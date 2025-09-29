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
