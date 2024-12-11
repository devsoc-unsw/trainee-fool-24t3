import Mailgun from "mailgun.js";
import FormData from 'form-data';

const mailgun = new Mailgun(FormData);

export const sendEmail = async (emailAddress: string, userName: string, code: string) => {
    if(process.env["CI"]) return;
    const key = process.env["EMAIL_KEY"]
    // don't send email when running tests.
    if(key === "test") {
        return;
    }

    const mg = mailgun.client({username: 'api', key: key || ""});
    if(!mg){ 
        throw new Error("invalid email key");
    }

    //console.log(`emailing ${userName} at ${emailAddress} with otp ${code}.`);
    const senderDomain = "mg.pyrmds.app";

    try {
        const res = await mg.messages.create(`${senderDomain}`, {
            from: `No Reply <noreply@${senderDomain}>`,
            to: [emailAddress],
            subject: "Pyramids Login One Time Code",
            text: "Hi",
            html: `
            <div>
                <p>Dear ${userName},</p>
                <p>We have received a request from you to reset your password for Pyramids.</p>
                <p>Your one time code is: <strong>${code}</strong>.</p>
                <p>Please note that this code will expire in 10 minutes.</p>
                <br/>
                <p>Thank you.</p>
            </div>`
        });
        //console.log(res);
    } catch (error) {
        throw new Error(`sending of email failed due to ${(error as Error).message}`);
    }
 }