import classes from "./Login.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { AtSymbolIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent } from "react";
import { Link } from "react-router";
import { errorHandler, AuthError } from "../errorHandler";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthError | undefined>(undefined);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5180/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(errorHandler(json.error));
    } else {
      setError(undefined);
    }
  }

  return (
    <main className={classes.container}>
      <div className={classes.upper} />
      <AuthScreen
        heading="Log in"
        text={
          <span>
            New to Pyramids? {}
            <Link className={classes.link} to="/register">
              Sign Up
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
            placeholder="Password"
            name="password"
            icon={<LockClosedIcon />}
            onChange={setPassword}
            type={TextOptions.Password}
            error={(error && error.passwordError) || false}
          />,
        ]}
        buttonText="Log in"
        footer={<p>Forgot Password</p>}
        onSubmit={handleSubmit}
        error={error}
      />
      <div className={classes.lower} />
    </main>
  );
}
