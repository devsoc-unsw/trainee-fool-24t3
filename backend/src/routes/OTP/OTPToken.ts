import { User } from "@prisma/client";

export interface OTPToken {
    user: User,
    token: string,
    timeCreated: Date,
    expiryTime: number,
}