# Interview Master - Server

This is the backend API for **Interview Master**, an AI-powered interview preparation platform. Built with **Express.js**, **MongoDB**, and **Google Generative AI**, it handles user authentication, PDF resume parsing, job description analysis, and AI-driven interview report generation.

## ✨ Features
- **User Authentication:** JWT-based auth with bcrypt password hashing
- **Resume Processing:** PDF parsing and text extraction
- **AI Report Generation:** Uses Google's Generative AI to generate interview questions, skill gaps, and preparation roadmaps
- **Report Storage:** MongoDB persistence for interview reports
- **API Documentation:** Swagger UI integration for interactive API docs
- **Token Blacklisting:** Logout mechanism with token invalidation

## 📁 Folder Structure & File Architecture

```
server/
├── package.json                    # Project dependencies and npm scripts
├── package-lock.json               # Locked versions of dependencies
├── server.js                       # Application entry point
│
└── src/
    ├── app.js                      # Express app configuration
    │
    ├── config/
    │   ├── config.js               # Environment variables and config
    │   ├── db.js                   # MongoDB connection setup
    │   └── swagger.js              # Swagger/OpenAPI documentation config
    │
    ├── models/
    │   ├── user.models.js          # User schema with password hashing
    │   ├── interviewreport.model.js # Interview report schema with nested sub-schemas
    │   └── blacklist.model.js      # Token blacklist for logout
    │
    ├── controllers/
    │   ├── auth.controller.js      # Authentication logic (register, login, logout, getMe)
    │   └── interview.controller.js # Interview report generation and retrieval
    │
    ├── routes/
    │   ├── auth.routes.js          # Auth endpoints with Swagger docs
    │   └── interview.routes.js     # Interview endpoints with Swagger docs
    │
    ├── middlewares/
    │   ├── auth.middleware.js      # JWT verification middleware
    │   └── multer.middleware.js    # File upload middleware for PDF resume
    │
    ├── services/
    │   └── ai.service.js           # Google Generative AI integration
    │
    └── utils/
        ├── config.js               # Configuration loader
        ├── jwtToken.js             # JWT token generation
        ├── dummyData.js            # Test data for development
        ├── test-pdf.js             # PDF testing utilities
        └── testing.json            # Test data JSON file
```

## 📄 Detailed File Descriptions

### Root Files

#### `package.json`
- **Purpose:** Defines project metadata, dependencies, and npm scripts
- **Key Scripts:**
  - `npm start` - Run production server
  - `npm run dev` - Run development server with nodemon auto-reload
- **Key Dependencies:**
  - `express` - Web framework
  - `mongoose` - MongoDB ODM
  - `@google/generative-ai` - Google AI API
  - `jsonwebtoken` - JWT token handling
  - `bcrypt` - Password hashing
  - `multer` - File upload middleware
  - `pdf-parse` - PDF text extraction
  - `swagger-ui-express` - API documentation
  - `dotenv` - Environment variable loading
  - `cors` - Cross-origin resource sharing
  - `cookie-parser` - Cookie parsing

#### `server.js`
- **Purpose:** Application entry point
- **Functions:**
  - Connects to MongoDB database
  - Starts Express server on configured port
  - Error handling for connection failures
  - Test AI service invocation (commented out)
  - Uses dummy data for testing

### Configuration

#### `src/config/config.js`
- **Purpose:** Centralized configuration from environment variables
- **Exports:**
  - `port` - Server port (default: 7611)
  - `mongo_uri` - MongoDB connection string
  - `node_env` - Environment (development/production)
  - `db_name` - Database name
  - `jwt_secret` - Secret key for JWT signing
  - `google_genai_api_key` - Google Generative AI API key
- **Validation:** Checks for required API keys and logs warnings

#### `src/config/db.js`
- **Purpose:** MongoDB connection management
- **Functions:**
  - Establishes connection to MongoDB using Mongoose
  - Handles connection errors
  - Returns Promise for async connection handling

#### `src/config/swagger.js`
- **Purpose:** Swagger/OpenAPI documentation configuration
- **Features:**
  - API title and description
  - Version information
  - Server URLs
  - Authentication schemes (Bearer + Cookie)
  - Tag definitions for organizing endpoints

### Models (MongoDB Schemas)

#### `src/models/user.models.js`
- **Purpose:** User account data model
- **Fields:**
  - `username` (String, unique, required) - User's login name
  - `email` (String, unique, required) - User's email address
  - `password` (String, required) - Hashed password
  - `timestamps` - Auto-managed createdAt/updatedAt
- **Methods:**
  - `pre("save")` hook - Automatically hashes password before saving (uses bcrypt, 10 salt rounds)
  - `comparePassword(password)` - Compares provided password with hashed password
- **Indexes:** Unique indexes on username and email for fast lookups

#### `src/models/interviewreport.model.js`
- **Purpose:** Interview report data model with nested sub-schemas
- **Sub-schemas:**
  - **technicalQuestionsSchema** - Array of technical Q&A objects
    - `question` (String) - The interview question
    - `intention` (String) - Why this question is asked
    - `answer` (String) - Suggested answer
  - **behavioralQuestionsSchema** - Array of behavioral Q&A objects (same structure as technical)
  - **skillsGapSchema** - Array of skill gap objects
    - `skill` (String) - Name of the skill gap
    - `severity` (String, enum: "high"/"medium"/"low") - Severity level
  - **preparationPlanSchema** - Array of daily preparation items
    - `day` (Number) - Day number (1-7, etc.)
    - `focus` (String) - Daily focus area
    - `tasks` (Array of Strings) - Daily tasks and activities
- **Main Fields:**
  - `jobDescription` (String) - Target job description
  - `title` (String) - Job title
  - `resume` (String) - Parsed resume text
  - `selfDescription` (String) - Candidate's self-description
  - `matchScore` (Number, 0-100) - Resume-to-job fit score
  - `technicalQuestions` - Array of technical Q&A
  - `behavioralQuestions` - Array of behavioral Q&A
  - `skillGaps` - Array of identified skill gaps
  - `preparationPlan` - Day-by-day preparation plan
  - `user` (ObjectId ref: User) - Report owner (foreign key)
  - `timestamps` - createdAt/updatedAt auto-managed

#### `src/models/blacklist.model.js`
- **Purpose:** Stores invalidated JWT tokens for logout
- **Fields:**
  - `token` (String, unique) - The invalidated JWT token
  - `createdAt` (Date) - Timestamp of blacklist entry
  - TTL Index - Auto-deletes old entries after expiration
- **Usage:** Checked in auth middleware to prevent use of logged-out tokens

### Controllers (Business Logic)

#### `src/controllers/auth.controller.js`
- **Purpose:** Handles all authentication logic
- **Exports:**
  - **`register(req, res)`**
    - Endpoint: `POST /api/v1/auth/register`
    - Request: `{ username, email, password }`
    - Validation: All fields required, username/email unique
    - Response: User object + JWT token in HttpOnly cookie
    - Status: 201 (Created)
  - **`login(req, res)`**
    - Endpoint: `POST /api/v1/auth/login`
    - Request: `{ email, password }`
    - Validation: Email exists, password matches
    - Response: User object + JWT token in HttpOnly cookie + response body token
    - Status: 200 (Success)
  - **`logout(req, res)`**
    - Endpoint: `GET /api/v1/auth/logout` (requires JWT)
    - Functions: Clears token cookie, adds token to blacklist
    - Response: Logout success message
    - Status: 200 (Success)
  - **`getMe(req, res)`**
    - Endpoint: `GET /api/v1/auth/get-me` (requires JWT)
    - Functions: Returns currently authenticated user (from req.user set by middleware)
    - Response: User object (password excluded)
    - Status: 200 (Success)

#### `src/controllers/interview.controller.js`
- **Purpose:** Handles interview report generation and retrieval
- **Exports:**
  - **`generateInterviewReportAI(req, res)`**
    - Endpoint: `POST /api/v1/interview/generate-report` (requires JWT, multipart/form-data)
    - Request: `{ resume (PDF file), jobDescription, selfDescription }`
    - Process:
      1. Validates resume upload
      2. Parses PDF to extract text
      3. Calls AI service with resume + job description
      4. Saves report to MongoDB
      5. Returns generated report
    - Response: Complete interview report object
    - Status: 201 (Created)
  - **`getAllInterviewReports(req, res)`**
    - Endpoint: `GET /api/v1/interview/get-all-reports` (requires JWT)
    - Functions: Retrieves all reports for authenticated user
    - Response: Array of report objects (minimal data)
    - Status: 200 (Success)
  - **`getInterviewReportById(req, res)`**
    - Endpoint: `GET /api/v1/interview/get-report/:id` (requires JWT)
    - Request: MongoDB ObjectId in URL
    - Validation: Valid ObjectId format
    - Response: Complete report object
    - Status: 200 (Success)

### Routes (API Endpoints)

#### `src/routes/auth.routes.js`
- **Purpose:** Authentication route definitions with Swagger documentation
- **Routes:**
  - `POST /register` - Register new user
  - `POST /login` - Login user
  - `GET /logout` - Logout user (protected)
  - `GET /get-me` - Get current user (protected)
- **Security:** Uses `verifyJWT` middleware on protected routes
- **Documentation:** Complete Swagger JSDoc comments for each endpoint

#### `src/routes/interview.routes.js`
- **Purpose:** Interview report route definitions with Swagger documentation
- **Routes:**
  - `POST /generate-report` - Generate AI report (protected, multipart/form-data)
  - `GET /get-all-reports` - Get all user reports (protected)
  - `GET /get-report/:id` - Get specific report (protected)
- **Security:** Uses `verifyJWT` middleware and `upload` (Multer) middleware
- **Documentation:** Complete Swagger JSDoc comments for each endpoint

### Middlewares

#### `src/middlewares/auth.middleware.js`
- **Purpose:** JWT token verification and authentication
- **Exports:**
  - **`verifyJWT(req, res, next)`**
    - Extracts token from cookies or Authorization header
    - Validates JWT signature using jwt_secret
    - Checks if token is blacklisted (for logout)
    - Verifies user still exists in database
    - Sets `req.user` with user object (password excluded)
    - Sets `req.token` with the token
    - Returns 401 if invalid/missing/expired token
    - Calls `next()` if valid
- **Token Sources:** Accepts from cookies (priority) or Authorization header

#### `src/middlewares/multer.middleware.js`
- **Purpose:** File upload handling for resume PDFs
- **Configuration:**
  - Destination: Temporary storage location
  - File size limits
  - Accepted MIME types: PDF
  - Single file upload: "resume" field name
- **Exports:**
  - `upload` - Multer middleware instance
  - Used in interview report generation endpoint

### Services

#### `src/services/ai.service.js`
- **Purpose:** Google Generative AI integration for report generation
- **Uses:** Google's Generative AI with structured output (JSON Schema)
- **Exports:**
  - **`generateInterviewReport(jobDescription, resume, selfDescription)`**
    - Initializes Google Generative AI client
    - Defines JSON schema for structured report output
    - Calls Gemini model with prompt
    - Returns parsed structured report with:
      - `matchScore` (0-100)
      - `title` (job title)
      - `technicalQuestions` (array of Q&A)
      - `behavioralQuestions` (array of Q&A)
      - `skillGaps` (array with severity)
      - `preparationPlan` (day-by-day tasks)
- **Schema:** Uses Zod-compatible JSON schema for type safety

### Utilities

#### `src/utils/jwtToken.js`
- **Purpose:** JWT token generation
- **Exports:**
  - **`generateToken(user)`**
    - Creates JWT token with payload: `{ id, email, username }`
    - Expiration: 1 hour
    - Uses `config.jwt_secret` for signing
    - Returns encoded JWT string

#### `src/utils/dummyData.js`
- **Purpose:** Test data for development and testing
- **Exports:**
  - `jobDescription` - Sample job posting
  - `resume` - Sample resume text
  - `selfDescription` - Sample candidate description
  - Used in `server.js` for testing AI service

#### `src/utils/test-pdf.js`
- **Purpose:** PDF testing utilities
- **Functions:** Helper functions for PDF processing during tests

#### `src/utils/testing.json`
- **Purpose:** Static JSON test data
- **Contents:** Sample test cases and expected outputs

#### `src/utils/config.js`
- **Purpose:** Configuration utilities
- **Functions:** Helper functions for config management

## 🛠 Tech Stack
* **Framework:** Express.js 5.x
* **Database:** MongoDB with Mongoose ODM
* **AI/ML:** Google Generative AI (@google/generative-ai)
* **Authentication:** JWT + bcrypt
* **File Upload:** Multer
* **PDF Processing:** pdf-parse
* **API Documentation:** Swagger UI Express + Swagger JSDoc
* **Password Hashing:** bcrypt (10 salt rounds)
* **Development:** Nodemon for auto-reload

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ installed
- MongoDB instance running (local or Atlas)
- Google Generative AI API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=7611
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=interview-master
   JWT_SECRET=your-super-secret-jwt-key-change-this
   GOOGLE_GENAI_API_KEY=your-google-api-key
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

Server runs on `http://localhost:7611`

### API Documentation

Once running, visit `http://localhost:7611/api-docs` for interactive Swagger UI documentation.

## 🔐 Authentication Flow

1. **Registration**: User sends username, email, password → Hashed and stored
2. **Login**: User sends email, password → Verified with bcrypt
3. **Token Generation**: JWT created with 1-hour expiration
4. **Token Storage**: Sent in HttpOnly cookie + response body
5. **Protected Requests**: Token extracted from cookies/headers, verified by middleware
6. **Logout**: Token added to blacklist to prevent reuse

## 📊 Interview Report Generation Flow

1. Client uploads resume PDF + job description
2. Server receives multipart form data
3. Multer extracts and stores PDF temporarily
4. PDF text extracted using pdf-parse
5. Resume + job description sent to Google Generative AI
6. AI generates structured report (JSON Schema validation)
7. Report saved to MongoDB with user reference
8. Report returned to client

## 🗄️ Database Models Relationship

```
User (1) ──────────────── (Many) InterviewReport
  _id                           user (ObjectId ref)
  username
  email
  password (hashed)         Each Report contains:
  timestamps                - Technical Questions (embedded)
                            - Behavioral Questions (embedded)
                            - Skill Gaps (embedded)
                            - Preparation Plan (embedded)
                            - timestamps
```

## 🔑 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `7611` |
| `MONGO_URI` | Yes | MongoDB connection | `mongodb://localhost:27017` |
| `DB_NAME` | Yes | Database name | `interview-master` |
| `JWT_SECRET` | Yes | JWT signing secret | `your-secret-key` |
| `GOOGLE_GENAI_API_KEY` | Yes | Google AI API key | `AIzaXxxx...` |
| `NODE_ENV` | No | Environment | `development` or `production` |

## 🛡️ Security Measures

- **Passwords:** Hashed with bcrypt (10 salt rounds)
- **JWT:** HttpOnly cookies prevent XSS attacks
- **CORS:** Configured for frontend origin only
- **Token Expiration:** 1 hour default
- **Token Blacklist:** Logged-out tokens invalidated
- **Password Not Returned:** Excluded from API responses with `.select("-password")`

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "user": { "_id": "...", "username": "..." },
  "data": { /* resource data */ }
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "error details"
}
```

## 🐛 Debugging Tips

1. **MongoDB Connection Issues:** Check MONGO_URI and ensure MongoDB is running
2. **JWT Errors:** Verify JWT_SECRET is set and matches frontend expectations
3. **AI Service Errors:** Ensure GOOGLE_GENAI_API_KEY is valid
4. **CORS Issues:** Check origin in app.js matches frontend URL
5. **File Upload Issues:** Check Multer configuration and file size limits

## 📄 API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user (protected)
- `GET /api/v1/auth/get-me` - Get current user (protected)

### Interview Reports
- `POST /api/v1/interview/generate-report` - Generate new report (protected)
- `GET /api/v1/interview/get-all-reports` - Get all user reports (protected)
- `GET /api/v1/interview/get-report/:id` - Get specific report (protected)

## 🚦 Status Codes Used

- `200` - Success (GET requests)
- `201` - Created (POST requests creating resources)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 📦 Building & Deployment

```bash
# Development
npm run dev

# Production Build (no build step needed for Node.js)
npm start

# Docker (if applicable)
docker build -t interview-master-server .
docker run -p 7611:7611 --env-file .env interview-master-server
```

## 📝 Notes

- Token expiration is set to 1 hour
- Resume PDFs are parsed on-the-fly, not stored persistently
- Skill gaps, questions, and preparation plans are generated fresh by AI each time
- All timestamps use MongoDB's automatic timestamps
- User passwords are never returned in API responses
