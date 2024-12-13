import crypto from 'crypto';
import { getUserFromEmail } from './OTPToken';
import { sendEmail } from './sendEmail';

export const generateOTP = async (emailAddress: string) => {
  const user = await getUserFromEmail(emailAddress);

  if (!user) {
    throw new Error("User doesn't exist!");
  }

  const rand = crypto.randomBytes(4).readUint32BE(0);
  const sixDigits = (rand % 900000) + 100000;
  const otpCode = sixDigits.toString();

  try {
    await sendEmail(emailAddress, user.username, otpCode);
  } catch (error) {
    throw new Error('Error sending OTP email');
  }

  return otpCode;
};
