import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Interview Master',
            version: '1.0.0',
            description: 'Interview Master is a comprehensive platform designed to help users prepare for technical interviews through AI-powered mock interviews, resume analysis, and personalized feedback.',
        },
        servers: [
            {
                url: `http://localhost:${config.port || 7611}`,
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                }
            }
        },

    },
    // Identifies what actual backend route files hold the Swagger inline comments
    apis: ['./src/routes/*.routes.js'],
};

// Generates the native JSON config specification
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
