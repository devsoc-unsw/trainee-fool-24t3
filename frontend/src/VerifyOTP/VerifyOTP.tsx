import classes from "./VerifyOTP.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { useState, FormEvent } from "react";
import { KeyIcon } from "@heroicons/react/24/outline";
import { errorHandler, AuthError } from "../errorHandler";

export default function VerifyOTP() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<AuthError | undefined>(undefined);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5180/auth/otp/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
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
        text={<p>Enter the code sent to your email.</p>} //replace "your email" with their email
        inputs={[
          <TextInput
            placeholder="Enter Code"
            name="code"
            icon={<KeyIcon />}
            onChange={setCode}
            type={TextOptions.Text}
          />,
        ]}
        buttonText="Submit"
        onSubmit={handleSubmit}
      ></AuthScreen>
    </main>
  );
}
