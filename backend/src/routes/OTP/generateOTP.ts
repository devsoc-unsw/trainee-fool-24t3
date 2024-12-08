import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getUserFromEmail } from './OTPToken';
import { sendEmail } from './sendEmail';

export const generateOTP = async (emailAddress: string, salt_rounds: number) => {
    const user = await getUserFromEmail(emailAddress);
    
    if(!user) {
      throw new Error("User not found.");
    }
    
    const rand = crypto.randomBytes(4).readUint32BE(0);
    const sixDigits = (rand % 900000) + 100000;
    const otpCode = sixDigits.toString(); 
    const hash = await bcrypt.hash(otpCode, salt_rounds);
    
    await sendEmail(emailAddress, user.username, otpCode);

    return hash;
}
