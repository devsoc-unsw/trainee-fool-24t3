import classes from "./Register.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { AtSymbolIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent } from "react";
import { Link } from "react-router";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
    console.log(json);
  }

  return (
    <main className={classes.container}>
      <div className={classes.upper} />
      <AuthScreen
        heading="Sign Up"
        text={
          <span>
            Got an account? {}
            <Link to="/login">Log In</Link>
          </span>
        }
        inputs={[
          <TextInput
            placeholder="Username"
            name="username"
            icon={<UserCircleIcon />}
            onChange={setUsername}
            type={TextOptions.Text}
          />,
          <TextInput
            placeholder="Email"
            name="email"
            icon={<AtSymbolIcon />}
            onChange={setEmail}
            type={TextOptions.Email}
          />,
          <TextInput
            placeholder="Password"
            name="password"
            icon={<LockClosedIcon />}
            onChange={setPassword}
            type={TextOptions.Password}
          />,
        ]}
        buttonText="Sign up"
        onSubmit={handleSubmit}
      />
      <div className={classes.lower} />
    </main>
  );
}
