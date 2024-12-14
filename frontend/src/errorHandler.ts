export interface AuthError {
    message: string;
    usernameError: boolean;
    passwordError: boolean;
    emailError: boolean;
}

export function errorHandler(error: string): AuthError {
    switch(error) {
        case "Missing required fields":
            return {message: error, usernameError: true, passwordError: true, emailError: true,}
        case "User doesnt exist!":
            return {message: error, usernameError: true, passwordError: false, emailError: false,}
        case "Invalid password":
            return {message: error, usernameError: false, passwordError: true, emailError: false,}
        case "Account with same credentials already exists":
            return {message: error, usernameError: true, passwordError: false, emailError: true,}
        case "Error logging in":
            return {message: "There was an internal server error while you were logging in, try again later.", usernameError: true, passwordError: true, emailError: true,}
        case "User not found.":
            return {message: "Your email was not found in our system.", usernameError: false, passwordError: false, emailError: true,}
        default:
            return {message: `An unexpected error occured: ${error}`, usernameError: true, passwordError: true, emailError: true,}
    }

}