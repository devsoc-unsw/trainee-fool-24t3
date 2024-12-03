import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { addTokenToDb, deleteToken, getUserFromEmail, OTPToken } from './OTPToken';
import { sendEmail } from './sendEmail';
import { RedisClientType, RedisModules } from 'redis';

export const generateOTP = async (emailAddress: string, salt_rounds: number) => {
    const user = await getUserFromEmail(emailAddress);
    
    if(!user) {
      throw new Error("User not found.");
    }
    
    //await deleteToken(user.id);

    const rand = crypto.randomBytes(4).readUint32BE(0);
    const sixDigits = (rand % 900000) + 100000;
    const otpCode = sixDigits.toString(); 
    const hash = await bcrypt.hash(otpCode, salt_rounds);
    
    // const token: OTPToken = {
    //   token: hash,
    //   timeCreated: new Date(),
    //   expiryTime: new Date(Date.now()+60000),
    // };

    //await addTokenToDb(token);
    
    await sendEmail(emailAddress, user.username, otpCode);

    return hash;
}
