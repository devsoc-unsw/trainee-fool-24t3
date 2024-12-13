import { getDb } from "../../config/db";
import bcrypt from "bcrypt";

const db = getDb();

export const updateUserPasswordFromEmail = async(email: string, newPassword: string, saltRounds: number) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await db.user.update({
        where: {
            email: email
        },
        data: {
            password: hashedPassword
        }
    });

    return result;
}

export const findUserFromId = async(id: number) => {
    const result = await db.user.findUniqueOrThrow({
        where: {
            id: id
        }
    });

    return result;
}