import cron from 'node-cron';
import prisma from '../../prisma';

export const removeExpiredOTPs = cron.schedule('* * * * *', async () => {
        try {
            await prisma.otpToken.deleteMany({
                where: {
                    expiryTime: {
                        lte: new Date(),
                    },
                },
            });
        } catch (error) {
            console.error(error);
        }
     });