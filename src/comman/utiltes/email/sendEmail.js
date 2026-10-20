import nodemailer from "nodemailer";
import { APP_NAME, MAIL_PASSWORD, MAIL_USER } from "../../../../config/config.service.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, attachments, html, cc, bcc }={}) => {
  const info = await transporter.sendMail({
    from:`${APP_NAME}:${MAIL_USER}`, // sender address
    cc,
    bcc,
    to, // list of recipients
    subject, // subject line
    html, // HTML body
    attachments
});
console.log("Message sent: %s", info.messageId);
}