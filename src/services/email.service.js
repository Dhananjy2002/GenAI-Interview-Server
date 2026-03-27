import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { config } from '../config/config.js';

const OAuth2 = google.auth.OAuth2;

export const sendEmail = async (to, subject, text, html) => {
    try {
        if (!config.google_client_id || !config.google_client_secret || !config.google_refresh_token) {
            console.error('⚠️  Google OAuth2 credentials are not fully set in .env');
            throw new Error('Google OAuth2 credentials missing');
        }

        // Create the OAuth2 client here so it always uses the loaded config values
        const oauth2Client = new OAuth2(
            config.google_client_id,
            config.google_client_secret,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: config.google_refresh_token
        });

        const accessTokenResponse = await oauth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token;

        if (!accessToken) {
            throw new Error('Failed to obtain access token from Google OAuth2');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.google_user,
                clientId: config.google_client_id,
                clientSecret: config.google_client_secret,
                refreshToken: config.google_refresh_token,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: `"Interview Master" <${config.google_user}>`,
            to,
            subject,
            text,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}:`, result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};
