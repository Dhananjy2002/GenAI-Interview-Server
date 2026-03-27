import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { config } from '../config/config.js';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.google_client_id,
    config.google_client_secret,
    'https://developers.google.com/oauthplayground'
);

if (config.google_refresh_token) {
    oauth2Client.setCredentials({
        refresh_token: config.google_refresh_token
    });
}

export const sendEmail = async (to, subject, text, html) => {
    try {
        if (!config.google_client_id || !config.google_refresh_token) {
            console.error('⚠️  Google OAuth2 credentials are not fully set in .env');
            return;
        }

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.google_user,
                clientId: config.google_client_id,
                clientSecret: config.google_client_secret,
                refreshToken: config.google_refresh_token,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: config.google_user,
            to,
            subject,
            text,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};
