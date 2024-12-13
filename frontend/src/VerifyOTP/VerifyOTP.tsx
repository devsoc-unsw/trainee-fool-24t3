import classes from './VerifyOTP.module.css';
import { AuthScreen } from '../AuthScreen/AuthScreen';
import { TextInput, TextOptions } from '../TextInput/TextInput';
import { useState, FormEvent } from 'react';
import { KeyIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { errorHandler, AuthError } from '../errorHandler';
import { useLocation } from 'react-router';

export default function VerifyOTP() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState<AuthError | undefined>(undefined);
  const { state } = useLocation();
  const { email } = state;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !password || !confirmedPassword) {
      setError({
        message: 'Please make sure all fields are filled out.',
        usernameError: false,
        passwordError: false,
        emailError: false,
      });
      return;
    }

    if (password !== confirmedPassword) {
      setError({
        message: 'Please make sure your passwords match.',
        usernameError: false,
        passwordError: true,
        emailError: false,
      });
      return;
    }

    const res = await fetch('http://localhost:5180/auth/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        email,
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(errorHandler(json.message));
    } else {
      setError(undefined);
    }
  }
  return (
    <main className={classes.container}>
      <AuthScreen
        heading="Account recovery"
        text={
          <span>
            Enter the code sent to the email associated with your account, as
            well as your new password.
          </span>
        }
        inputs={[
          <TextInput
            placeholder="Enter code"
            name="code"
            icon={<KeyIcon />}
            onChange={setToken}
            type={TextOptions.Text}
            error={error !== undefined || false}
          />,
          <TextInput
            placeholder="Password"
            name="password"
            icon={<LockClosedIcon />}
            onChange={setPassword}
            type={TextOptions.Password}
            error={(error && error.passwordError) || false}
          />,
          <TextInput
            placeholder="Confirm password"
            name="password"
            icon={<LockClosedIcon />}
            onChange={setConfirmedPassword}
            type={TextOptions.Password}
            error={
              (error && error.passwordError) ||
              confirmedPassword !== password ||
              false
            }
          />,
        ]}
        buttonText="Submit"
        onSubmit={handleSubmit}
        error={error}
      ></AuthScreen>
    </main>
  );
}
