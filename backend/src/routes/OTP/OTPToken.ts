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