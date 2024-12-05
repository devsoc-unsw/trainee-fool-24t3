import classes from "./Login.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput } from "../TextInput/TextInput";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
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
          />,
          <TextInput
            placeholder="Password"
            name="password"
            icon={<LockClosedIcon />}
          />,
        ]}
        buttonText="Log in"
        footer={<p>Forgot Password</p>}
      />
      <div className={classes.lower} />
    </main>
  );
}
