import classes from "./GenerateOTP.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { useState, FormEvent } from "react";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { errorHandler, AuthError } from "../errorHandler";

export default function GenerateOTP() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<AuthError | undefined>(undefined);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5180/auth/otp/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
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
      <AuthScreen
        heading="Account Recovery"
        text={<p>Enter your Email.</p>} //replace "your email" with their email
        inputs={[
          <TextInput
            placeholder="Email"
            name="email"
            icon={<AtSymbolIcon />}
            onChange={setEmail}
            type={TextOptions.Email}
            error={(error && error.emailError) || false}
          />,
        ]}
        buttonText="Submit"
        onSubmit={handleSubmit}
        error={error}
      ></AuthScreen>
    </main>
  );
}
