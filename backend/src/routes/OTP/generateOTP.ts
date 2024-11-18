import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '../../prisma';
import { OTPToken } from './OTPToken';
import { sendEmail } from './sendEmail';

export const generateOTP = async (emailAddress: string, salt_rounds: number) => {
    const user = await getUserFromEmail(emailAddress);
    
    if(!user) {
      throw new Error("User not found.");
    }
    
    await deleteToken(user.id);

    const rand = crypto.randomBytes(4).readUint32BE(0);
    const sixDigits = (rand % 900000) + 100000;
    const otpCode = sixDigits.toString(); 
    const hash = await bcrypt.hash(otpCode, salt_rounds);
    
    const token: OTPToken = {
      user,
      token: hash,
      timeCreated: new Date(),
      expiryTime: new Date(Date.now()+60000),
    };

    await addTokenToDb(token);
    
    await sendEmail(emailAddress, user.username, otpCode);

    return true;
}

const getUserFromEmail = async (emailAddress: string) => {
    const result = await prisma.user.findUnique({
        where: {
          email: emailAddress,
        },
      });

      return result;
}

const deleteToken = async(userId: number) => {
  const result = await prisma.otpToken.deleteMany({
    where: {
      userId
    }
  });

  return result;
}

const addTokenToDb = async(token: OTPToken) => {
  const result = await prisma.otpToken.create({
    data: {
      userId: token.user.id,
      token: token.token,
      timeCreated: token.timeCreated,
      expiryTime: token.expiryTime
    }
  });
  return result;
}