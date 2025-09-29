/**
 * Swagger (OpenAPI) Documentation Config
 * ------------------------------------
 * sets up Swagger UI for interactive API documentation.
 * we are not using yaml or any specific swagger file. just top comment in route files
 * responsibilities:
 * - Define API metadata (title, version, description)
 * - Point to route files for JSDoc comments
 * - Serve interactive docs at /api/docs
 * 
 * benefit:
 * - Auto-generates and updates docs as routes evolve
 */

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API documentation for User Management Project",
    },
    servers: [
      {
        url: "http://localhost:8888", // change for production
      },
    ],
  },
  apis: ["./routes/*.js"], // 👈 will pull JSDoc comments from routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
