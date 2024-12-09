import classes from "./Login.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(email);
    console.log(password);
  }

  return (
    <main className={classes.container}>
      <div className={classes.upper} />
      <AuthScreen
        heading="Log in"
        text={<span>New to Pyramids?</span>}
        inputs={[
          <TextInput
            placeholder="Email"
            name="email"
            icon={<AtSymbolIcon />}
            onChange={setEmail}
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
