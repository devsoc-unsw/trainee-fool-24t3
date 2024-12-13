import classes from "./Login.module.css";
import { AuthScreen } from "../AuthScreen/AuthScreen";
import { TextInput, TextOptions } from "../TextInput/TextInput";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
<<<<<<< HEAD
import { useState, FormEvent, useContext } from "react";
=======
import { useState, FormEvent } from "react";
>>>>>>> c0fca79 (added redirection upon registration and logging in)
import { Link, useNavigate } from "react-router";
import { errorHandler, AuthError } from "../errorHandler";
import { UserContext, User } from "../UserContext/UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthError | undefined>(undefined);
<<<<<<< HEAD
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

=======
  const navigate = useNavigate();
>>>>>>> c0fca79 (added redirection upon registration and logging in)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await fetch("http://localhost:5180/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(errorHandler(json.error));
    } else if (setUser) {
      setError(undefined);
      setUser(json as User);
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        navigate("/timeline");
      }, 1000);
    } else {
      setError(errorHandler("Couldn't update user object."));
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
        success={success}
      />
      <div className={classes.lower} />
    </main>
  );
}
