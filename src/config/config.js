import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 7611,
    mongo_uri: process.env.MONGO_URI,
    node_env: process.env.NODE_ENV || 'development',
    db_name: process.env.DB_NAME,
    jwt_secret: process.env.JWT_SECRET,
    google_genai_api_key: process.env.GOOGLE_GENAI_API_KEY,
    frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    google_user: process.env.GOOGLE_USER,
    resend_api_key: process.env.RESEND_API_KEY,
};

// Validate critical env vars
if (!config.google_genai_api_key) {
    console.error("⚠️  GOOGLE_GENAI_API_KEY is not set in .env file");
}

