import bcrypt from 'bcrypt';

export const verifyOTP = async (token: string, hash: string) => {
    const verify = await bcrypt.compare(token, hash);

    if(!verify) {
        throw new Error("Incorrect code.");
    }
    
    return verify;
}