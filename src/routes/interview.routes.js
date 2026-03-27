import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  generateInterviewReportAI,
  getAllInterviewReports,
  getInterviewReportById,
  generateResumePDFPup,
} from "../controllers/interview.controller.js";

export const interviewRouter = Router();

/**
 * @swagger
 * /api/v1/interview/generate-report:
 *   post:
 *     summary: Generate interview report
 *     tags:
 *       - Interview
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *               - selfDescription
 *               - jobDescription
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *               selfDescription:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Interview report generated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
interviewRouter.post(
  "/generate-report",
  verifyJWT,
  upload.single("resume"),
  generateInterviewReportAI,
);

/**
 * @swagger
 * /api/v1/interview/get-all-reports:
 *   get:
 *     summary: Get all interview reports
 *     tags:
 *       - Interview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interview reports fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
interviewRouter.get("/get-all-reports", verifyJWT, getAllInterviewReports);

/**
 * @swagger
 * /api/v1/interview/get-report/{id}:
 *   get:
 *     summary: Get interview report by ID
 *     tags:
 *       - Interview
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the interview report
 *     responses:
 *       200:
 *         description: Interview report fetched successfully
 *       400:
 *         description: Invalid ID supplied
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
interviewRouter.get("/get-report/:id", verifyJWT, getInterviewReportById);

/**
 * @swagger
 * /api/v1/interview/get-resume/pdf/{interviewReportId}:
 *   post:
 *     summary: Get the resume pdf file
 *     tags:
 *       - Interview
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewReportId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the interview report
 *     responses:
 *       200:
 *         description: Resume PDF generated successfully
 *       400:
 *         description: Invalid ID supplied
 *       401:
 *         description: Unauthorized
 */
interviewRouter.post(
  "/get-resume/pdf/:interviewReportId",
  verifyJWT,
  generateResumePDFPup,
);
