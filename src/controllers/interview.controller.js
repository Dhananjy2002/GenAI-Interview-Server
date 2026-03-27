import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

import {
  generateInterviewReport,
  generateResumePDF,
} from "../services/ai.service.js";

import InterviewReport from "../models/interviewreport.model.js";

export async function generateInterviewReportAI(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uint8Array = new Uint8Array(file.buffer);
    const resumeContent = await (new PDFParse(uint8Array)).getText();
    const { selfDescription, jobDescription, reportId } = req.body;

    const interviewAIReport = await generateInterviewReport(
      jobDescription,
      resumeContent.text,
      selfDescription,
    );

    let interviewReport;

    if (reportId && reportId !== "undefined") {
      interviewReport = await InterviewReport.findOneAndUpdate(
        { _id: reportId, user: req.user._id },
        {
          resume: resumeContent.text,
          selfDescription,
          jobDescription,
          ...interviewAIReport,
        },
        { new: true },
      );

      if (!interviewReport) {
        return res.status(404).json({ message: "Original report not found or authorized" });
      }
    } else {
      interviewReport = await InterviewReport.create({
        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewAIReport,
      });
    }

    return res.status(reportId ? 200 : 201).json({
      message: reportId ? "Interview report updated successfully" : "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllInterviewReports(req, res) {
  try {
    const interviewReports = await InterviewReport.find({ user: req.user._id })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getInterviewReportById(req, res) {
  try {
    const { id } = req.params;

    if (!id || id === ":id") {
      return res.status(400).json({ message: "Valid report ID is required" });
    }

    const interviewReport = await InterviewReport.findById(id).populate(
      "user",
      "-password",
    );

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function generateResumePDFPup(req, res) {
  try {
    const { interviewReportId } = req.params;
    const interviewReport = await InterviewReport.findById(interviewReportId);
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    const { resume, selfDescription, jobDescription } = interviewReport;
    const result = await generateResumePDF({
      resume,
      selfDescription,
      jobDescription,
    });
    const pdfBuffer = result.pdf;
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
