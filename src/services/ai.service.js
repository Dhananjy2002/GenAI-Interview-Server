import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { config } from "../config/config.js";
import puppeteer from "puppeteer";

const genAI = new GoogleGenerativeAI(config.google_genai_api_key);

const interviewReportSchema = {
  type: SchemaType.OBJECT,
  properties: {
    matchScore: {
      type: SchemaType.NUMBER,
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    title: {
      type: SchemaType.STRING,
      description:
        "The title of the job for which the interview report is generated",
    },
    technicalQuestions: {
      type: SchemaType.ARRAY,
      description: "Technical questions that can be asked in the interview",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "The technical question",
          },
          intention: {
            type: SchemaType.STRING,
            description: "The intention behind asking this question",
          },
          answer: {
            type: SchemaType.STRING,
            description: "How to answer this question",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: SchemaType.ARRAY,
      description: "Behavioral questions that can be asked in the interview",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "The behavioral question",
          },
          intention: {
            type: SchemaType.STRING,
            description: "The intention behind this question",
          },
          answer: {
            type: SchemaType.STRING,
            description: "How to answer this question",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: SchemaType.ARRAY,
      description: "List of skill gaps in the candidate's profile",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          skill: {
            type: SchemaType.STRING,
            description: "Skill the candidate is lacking",
          },
          severity: {
            type: SchemaType.STRING,
            enum: ["low", "medium", "high"],
            description: "Severity of gap",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: SchemaType.ARRAY,
      description: "A day-wise preparation plan",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER, description: "Day number" },
          focus: {
            type: SchemaType.STRING,
            description: "Main focus of this day",
          },
          tasks: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING, description: "Task to complete" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "title",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport(
  jobDescription,
  resume,
  selfDescription,
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema,
      },
    });

    const prompt = `
Generate a comprehensive interview preparation report based on the following information:

**Job Description:**
${jobDescription}

**Resume:**
${resume}

**Self Description:**
${selfDescription}

Please provide a structured JSON output exactly matching the provided schema. Include:
- A calculated match score (0-100)
- A synthesized job title
- At least 5 technical questions
- At least 5 behavioral questions
- Detailed skill gaps
- A structured 7-day preparation plan
        `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const parsedReport = JSON.parse(text);

    console.log("✅ Interview Report Generated Successfully");
    return parsedReport;
  } catch (error) {
    console.error("❌ Error generating interview report:", error.message);
    throw error;
  }
}

async function generatePDFfromHTML(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      margin: {
          top: '0.4in',
          bottom: '0.4in',
          left: '0.4in',
          right: '0.4in'
      }
  });
  await browser.close();
  return pdfBuffer;
}
async function generateResumePDF({ resume, jobDescription, selfDescription }) {
  try {
    // Define the schema for resume PDF generation
    const resumePDFSchema = {
      type: SchemaType.OBJECT,
      properties: {
        html: {
          type: SchemaType.STRING,
          description:
            "HTML content for the resume which will be used to generate the PDF",
        },
        summary: {
          type: SchemaType.STRING,
          description:
            "A brief summary of the resume highlighting key qualifications",
        },
      },
      required: ["html", "summary"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumePDFSchema,
      },
    });

    const prompt = `
        Generate a professional resume and summary for the candidate based on the following information:

        **Resume:**
        ${resume}

        **Job Description:**
        ${jobDescription}

        **Self Description:**
        ${selfDescription}

        Requirements:
        1. **Strict One-Page Limit**: Use highly compact, professional styling. The generated HTML MUST fit on exactly one A4 page. 
        2. **Layout**: Use a clean, modern, and space-efficient layout.
        3. **Styling**: Include an internal <style> block with:
           - Professional sans-serif font (e.g., Arial) at 10-11pt size.
           - Line-height: 1.3.
           - Minimal section margins (max 1rem).
           - Professional color palette (Blues/Greys).
        4. **Content**: Be concise. Prioritize only the most relevant achievements for the Job Description. Use bullet points.
        5. **Sections**: Contact, Professional Summary, Relevant Experience, Skills Matrix, Education, Projects/Certs.
        6. The HTML must be a complete document with <html>, <head>, and <body> tags.

        Return the response in the following JSON format:
        {
            "html": "Complete HTML string",
            "summary": "Brief 2-3 sentence teaser"
        }
        `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    const parsedReport = JSON.parse(text);

    const pdfBuffer = await generatePDFfromHTML(parsedReport.html);
    parsedReport.pdf = pdfBuffer;
    

    console.log("✅ Resume PDF Content Generated Successfully");
    return parsedReport;
  } catch (error) {
    console.error("❌ Error generating resume PDF content:", error.message);
    throw error;
  }
}

export { generateInterviewReport, generateResumePDF };
