import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {

    const sgApiKey = process.env.SENDGRID_API_KEY;
    if (!sgApiKey) {
        throw new Error('SENDGRID_API_KEY is not defined');
    }
    const sgEmailFrom  = process.env.EMAIL_FROM;
    if (!sgEmailFrom) {
        throw new Error('EMAIL_FROM is not defined');
      }

    
    sgMail.setApiKey(sgApiKey);



    const { name, email, message } = req.body;
    
    const emailData = {
    to: process.env.EMAIL_TO,
    from: sgEmailFrom,
    subject: `Portfolio Contact Form - ${process.env.SENDGRID_SUBJECT}`,
    text: `Email received from contact form \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
    `,
    };

    try {
    await sgMail.send(emailData);
    res.status(200).json({ success: true });
    } catch (error) {
    console.error("Email not sent", error);
    res.status(400).json({ success: false });
    }
}








