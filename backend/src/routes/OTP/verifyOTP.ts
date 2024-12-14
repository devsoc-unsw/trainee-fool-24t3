export const verifyOTP = (token: string, otp: string | null) => {
  if (!otp) {
    throw new Error('One time code is invalid or expired.');
  }

  if (otp !== token) {
    throw new Error('Incorrect code.');
  }
};
