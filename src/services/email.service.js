import { Resend } from 'resend';
import { config } from '../config/config.js';

const resend = new Resend(config.resend_api_key);

export const sendEmail = async (to, subject, text, html) => {
    try {
        if (!config.resend_api_key) {
            console.error('⚠️  RESEND_API_KEY is not set in environment variables');
            throw new Error('RESEND_API_KEY missing');
        }

        const { data, error } = await resend.emails.send({
            from: 'Interview Master <onboarding@resend.dev>',
            to,
            subject,
            text,
            html,
        });

        if (error) {
            console.error('❌ Resend error:', error);
            throw new Error(error.message);
        }

        console.log(`✅ Email sent successfully to ${to}:`, data?.id);
        return data;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};
