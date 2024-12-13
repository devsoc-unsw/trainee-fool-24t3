import classes from "./Register.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { AtSymbolIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { errorHandler, AuthError } from "../errorHandler";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<AuthError | undefined>(undefined);
  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5180/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(errorHandler(json.error));
    } else {
      setError(undefined);
      navigate("/login");
    }
  }

  return (
    <main className={classes.container}>
      <div className={classes.upper} />
      <AuthScreen
        heading="Sign Up"
        text={
          <span>
            Got an account? {}
            <Link className={classes.link} to="/login">
              Log In
            </Link>
          </span>
        }
        inputs={[
          <TextInput
            placeholder="Username"
            name="username"
            icon={<UserCircleIcon />}
            onChange={setUsername}
            type={TextOptions.Text}
            error={(error && error.usernameError) || false}
          />,
          <TextInput
            placeholder="Email"
            name="email"
            icon={<AtSymbolIcon />}
            onChange={setEmail}
            type={TextOptions.Email}
            error={(error && error.emailError) || false}
          />,
          <TextInput
            placeholder="Password"
            name="password"
            icon={<LockClosedIcon />}
            onChange={setPassword}
            type={TextOptions.Password}
            error={(error && error.passwordError) || false}
          />,
        ]}
        buttonText="Sign up"
        onSubmit={handleSubmit}
        error={error}
      />
      <div className={classes.lower} />
    </main>
  );
}
