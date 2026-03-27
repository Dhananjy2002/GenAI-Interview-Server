import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { interviewRouter } from "./routes/interview.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { config } from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        config.frontend_url, 
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/interview", interviewRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;