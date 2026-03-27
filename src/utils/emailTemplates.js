/**
 * Professional HTML Email Templates for Interview Master
 */

export const getWelcomeEmailTemplate = (username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Interview Master</title>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-top: 5px solid #6366f1; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: -1px; }
            .content { padding: 40px 30px; }
            .content h2 { color: #1e1b4b; margin-top: 0; font-size: 22px; }
            .content p { color: #4b5563; font-size: 16px; margin-bottom: 24px; }
            .feature-list { margin: 30px 0; padding: 0; list-style: none; }
            .feature-item { margin-bottom: 15px; display: flex; align-items: center; font-size: 15px; color: #374151; }
            .feature-icon { margin-right: 12px; font-size: 18px; color: #6366f1; }
            .button-wrapper { text-align: center; margin-top: 40px; }
            .button { background-color: #6366f1; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
            .footer p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Interview Master</h1>
            </div>
            <div class="content">
                <h2>Welcome aboard, ${username}!</h2>
                <p>We're thrilled to have you here! Interview Master is designed to be your ultimate companion in landing your dream job through AI-powered preparation and feedback.</p>
                
                <h3>What you can do now:</h3>
                <ul class="feature-list">
                    <li class="feature-item"><span class="feature-icon">✨</span> Generate custom interview reports from your resume.</li>
                    <li class="feature-item"><span class="feature-icon">✨</span> Get personalized technical & behavioral questions.</li>
                    <li class="feature-item"><span class="feature-icon">✨</span> Professional Resume generation in one single page.</li>
                </ul>

                <div class="button-wrapper">
                    <a href="https://genai-interview-client.vercel.app/login" class="button">Login to Dashboard</a>
                </div>
                
                <p style="margin-top: 40px;">If you have any questions, simply reply to this email. We're here to help!</p>
                <p>Best regards,<br>The Interview Master Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Interview Master AI. All rights reserved.</p>
                <p>Helping you prepare, perform, and prevail.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getResetPasswordEmailTemplate = (resetUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; line-height: 1.6; background-color: #f4f7f6; margin: 0; }
            .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .logo { color: #6366f1; font-weight: bold; font-size: 24px; margin-bottom: 30px; }
            .button { background-color: #6366f1; color: #fff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }
            .footer { margin-top: 40px; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">Interview Master</div>
            <h2>Password Reset Request</h2>
            <p>You recently requested to reset your password for your Interview Master account. Click the button below to proceed. This link is valid for **15 minutes**.</p>
            <div style="margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <div class="footer">
                This is an automated message. Please do not reply directly to this email.
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getContactAckTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>We've Received Your Message</title>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: -0.5px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 40px 30px; }
            .icon-wrapper { text-align: center; margin-bottom: 20px; }
            .icon { font-size: 50px; }
            .content h2 { color: #1e1b4b; margin-top: 0; font-size: 22px; text-align: center; }
            .content p { color: #4b5563; font-size: 16px; margin-bottom: 20px; }
            .message-box { background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%); border-left: 4px solid #10b981; padding: 20px; border-radius: 6px; margin: 25px 0; }
            .message-box p { margin: 0; color: #065f46; font-size: 15px; }
            .info-grid { display: table; width: 100%; margin: 30px 0; }
            .info-item { display: table-row; }
            .info-item span { display: table-cell; padding: 10px 0; }
            .info-label { color: #6b7280; font-size: 14px; width: 140px; }
            .info-value { color: #1f2937; font-weight: 500; }
            .helpful-links { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; }
            .helpful-links h4 { margin: 0 0 15px 0; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .link-list { margin: 0; padding: 0; list-style: none; }
            .link-item { margin-bottom: 10px; }
            .link-item a { color: #6366f1; text-decoration: none; font-size: 14px; display: flex; align-items: center; }
            .link-item a:hover { text-decoration: underline; }
            .link-icon { margin-right: 8px; }
            .button-wrapper { text-align: center; margin: 30px 0; }
            .button { background-color: #6366f1; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
            .signature p { margin: 5px 0; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
            .footer p { margin: 5px 0; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #6366f1; text-decoration: none; margin: 0 10px; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📬 Interview Master</h1>
                <p>Your AI-Powered Interview Companion</p>
            </div>
            <div class="content">
                <div class="icon-wrapper">
                    <span class="icon">✅</span>
                </div>
                <h2>We've Received Your Message!</h2>
                
                <p>Hi <strong>${name}</strong>,</p>
                
                <p>Thank you for reaching out to us! We've successfully received your message and our team is already on it.</p>
                
                <div class="message-box">
                    <p>📌 <strong>What happens next?</strong><br>
                    Our support team typically responds within <strong>24-48 hours</strong>. We'll get back to you at the email address you provided.</p>
                </div>
                
                <div class="helpful-links">
                    <h4>📚 While You Wait</h4>
                    <ul class="link-list">
                        <li class="link-item">
                            <a href="https://genai-interview-client.vercel.app/dashboard">
                                <span class="link-icon">🎯</span> Explore your Dashboard
                            </a>
                        </li>
                        <li class="link-item">
                            <a href="https://genai-interview-client.vercel.app/interview">
                                <span class="link-icon">🤖</span> Start a Practice Interview
                            </a>
                        </li>
                        <li class="link-item">
                            <a href="https://genai-interview-client.vercel.app/resume">
                                <span class="link-icon">📄</span> Build Your Professional Resume
                            </a>
                        </li>
                        <li class="link-item">
                            <a href="https://genai-interview-client.vercel.app/faq">
                                <span class="link-icon">❓</span> Check our FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="button-wrapper">
                    <a href="https://genai-interview-client.vercel.app/dashboard" class="button">Go to Dashboard →</a>
                </div>
                
                <div class="signature">
                    <p style="color: #374151;">Best regards,</p>
                    <p><strong style="color: #6366f1;">The Interview Master Team</strong></p>
                    <p style="font-size: 14px; color: #9ca3af;">We're here to help you ace your interviews! 🚀</p>
                </div>
            </div>
            <div class="footer">
                <div class="social-links">
                    <a href="#">Twitter</a> •
                    <a href="#">LinkedIn</a> •
                    <a href="#">GitHub</a>
                </div>
                <p>&copy; ${new Date().getFullYear()} Interview Master AI. All rights reserved.</p>
                <p>Helping you prepare, perform, and prevail.</p>
                <p style="margin-top: 10px; font-size: 11px; color: #d1d5db;">
                    This is an automated acknowledgment. You don't need to reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};


