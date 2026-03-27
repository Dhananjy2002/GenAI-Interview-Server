import { Contact } from "../models/contact.model.js";
import { sendEmail } from "../services/email.service.js";
import { getContactAckTemplate } from "../utils/emailTemplates.js";

/**
 * @route POST /api/v1/contact
 * @desc Submit a contact us query
 * @access Public
 */
export async function createContactQuery(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }

        // 1. First attempt to send the acknowledgment email
        try {
            const htmlContent = getContactAckTemplate(name);
            await sendEmail(
                email,
                "We've received your query! - Interview Master",
                `Hi ${name}, thank you for reaching out. We have received your message and will get back to you soon.`,
                htmlContent
            );
        } catch (mailError) {
            console.error("Failed to send contact acknowledgment email:", mailError.message);
            return res.status(500).json({ message: "Failed to send email. Please try again later.", error: mailError.message });
        }

        // 2. If email is successful, save the query to the database
        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        return res.status(201).json({
            message: "Query submitted successfully",
            contact
        });

    } catch (error) {
        console.error("Error in contact controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
