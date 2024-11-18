import Mailgun from "mailgun.js";
import FormData from 'form-data';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({username: 'api', key: process.env["EMAIL_KEY"] || ""});

export const sendEmail = async (emailAddress: string, userName: string, code: string) => {
    if(!mg){ 
        throw new Error("invalid email key");
    }

    console.log(`emailing ${userName} at ${emailAddress} with otp ${code}.`);
//     const senderDomain = "";

//     try {
//         await mg.messages.create(`${senderDomain}`, {
//             from: `No Reply <noreply@${senderDomain}>`,
//             to: [emailAddress],
//             subject: "Pyramids Login One Time Code",
//             text: "",
//             html: ""
//         });
//     } catch (error) {
//         throw new Error("sending of email failed");
//     }
 }