import { User } from "@prisma/client";
import prisma from "../../prisma";

export interface OTPToken {
    user: User,
    token: string,
    timeCreated: Date,
    expiryTime: Date,
}


export const getUserFromEmail = async (emailAddress: string) => {
    const result = await prisma.user.findUnique({
        where: {
          email: emailAddress,
        },
      });

      return result;
}

export const deleteToken = async(userId: number) => {
  const result = await prisma.otpToken.deleteMany({
    where: {
      userId
    }
  });

  return result;
}

export const addTokenToDb = async(token: OTPToken) => {
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

export const getTokenFromEmail = async(emailAddress: string) => {
    const user = await getUserFromEmail(emailAddress);
    if(!user) {
        throw new Error(`User with email address ${emailAddress} not found.`)
    }
    const otpToken = await prisma.otpToken.findFirst({
        where: {
            userId: user.id
        }
    });

    if(!otpToken) {
        throw new Error(`OTP Token for ${emailAddress} not found.`);
    }
    
    return otpToken;
}