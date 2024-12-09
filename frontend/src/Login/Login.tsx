import classes from "./Login.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5180/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const json = await res.json();
    console.log(json);
  }

  return (
    <main className={classes.container}>
      <div className={classes.upper} />
      <AuthScreen
        heading="Log in"
        text={<span>New to Pyramids?</span>}
        inputs={[
          <TextInput
            placeholder="Username"
            name="username"
            icon={<AtSymbolIcon />}
            onChange={setUsername}
            type={TextOptions.Text}
          />,
          <TextInput
            placeholder="Password"
            name="password"
            icon={<LockClosedIcon />}
            onChange={setPassword}
            type={TextOptions.Password}
          />,
        ]}
        buttonText="Log in"
        footer={<p>Forgot Password</p>}
        onSubmit={handleSubmit}
      />
      <div className={classes.lower} />
    </main>
  );
}
