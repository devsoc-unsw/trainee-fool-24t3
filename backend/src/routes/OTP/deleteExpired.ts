import cron from 'node-cron';
import prisma from '../../prisma';

export const removeExpiredOTPs = cron.schedule('1 * * * *', async () => {
        try {
            await prisma.otpToken.deleteMany({
                where: {
                    expiryTime: {
                        lte: new Date(Date.now()),
                    },
                },
            });
        } catch (error) {
            console.error(error);
        }
     });