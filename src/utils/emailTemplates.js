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
