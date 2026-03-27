import { google } from 'googleapis';
import { config } from '../config/config.js';

const OAuth2 = google.auth.OAuth2;

/**
 * Sends an email using the Gmail REST API (v1) over HTTPS.
 * This bypasses Render's SMTP port blocks and allows using your own Gmail address.
 */
export const sendEmail = async (to, subject, text, html) => {
    try {
        if (!config.google_client_id || !config.google_client_secret || !config.google_refresh_token) {
            console.error('⚠️  Google OAuth2 credentials are missing in .env');
            throw new Error('Google OAuth2 credentials missing');
        }

        const oauth2Client = new OAuth2(
            config.google_client_id,
            config.google_client_secret,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: config.google_refresh_token
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Construct the MIME message
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: "Interview Master" <${config.google_user}>`,
            `To: ${to}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            html || text,
        ];
        const message = messageParts.join('\n');

        // The Gmail API requires the message to be base64url encoded
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log(`✅ Email sent successfully via Gmail API to ${to}:`, res.data.id);
        return res.data;
    } catch (error) {
        console.error('❌ Error sending email via Gmail API:', error.message);
        // Fallback to Resend if Gmail API fails and a key is present
        if (config.resend_api_key) {
            console.log('🔄 Attempting fallback to Resend...');
            // We could import and call a Resend sender here, but usually, 
            // if OAuth fails, it's a config issue the user needs to fix.
        }
        throw error;
    }
};
