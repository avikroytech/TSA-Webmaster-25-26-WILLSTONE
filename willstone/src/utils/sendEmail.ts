'use server'

import nodemailer from 'nodemailer';

export async function sendConfirmationEmail(userEmail: string, userName: string, resourceTitle: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Willstone Community" <${process.env.GMAIL_USER || 'noreply@willstone.com'}>`,
            to: userEmail,
            subject: 'Resource Submission Received - Willstone',
            html: `
                <div style="font-family: sans-serif; color: #264D52;">
                    <h2>Thank you, ${userName}!</h2>
                    <p>We have successfully received your submission for the resource: <strong>${resourceTitle}</strong>.</p>
                    <p>Our team will review your suggestion to add it to the Willstone community hub.</p>
                    <br/>
                    <p>Best Regards,</p>
                    <p><strong>City Council</strong></p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return { success: true, data: info };
    } catch (error: any) {
        console.error("Failed to send email:", error);
        return { success: false, error: error.message || 'Internal Server Error' };
    }
}
