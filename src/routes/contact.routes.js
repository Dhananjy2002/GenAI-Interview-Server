import { Router } from "express";
import { createContactQuery } from "../controllers/contact.controller.js";

export const contactRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: User contact and support endpoints
 */

/**
 * @swagger
 * /api/v1/contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, subject, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Submitted successfully
 *       400:
 *         description: Missing fields or invalid email
 */
contactRouter.post("/", createContactQuery);
