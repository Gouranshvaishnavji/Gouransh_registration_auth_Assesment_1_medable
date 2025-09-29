# User Management API

This is a Node.js + Express project for user registration, authentication, and role-based authorization.

It was built as part of an assessment challenge where the goal was not just to implement features, but also to fix bugs, secure endpoints, and document the whole process.

## Features

* Registration with validation (strong password + valid email).
* Login with JWT authentication (token stored in cookies).
* Role-based authorization (user, admin).
* Centralized error handling with a custom `AppError` class.
* Logging with **Winston** (separate log files for requests and errors).
* Request IDs for traceability across logs.
* **Swagger (OpenAPI)** API documentation.
* Puzzle secret endpoint (accessible only with the right header/query and admin role).
* In-memory user storage (mock NoSQL-style DB).

## Prerequisites

You need:
* Node.js v18 or higher
* npm (comes with Node.js)

## Setup Instructions

#### 1. Clone the repository
```bash
git clone <your-repo-url>
cd user-management-api
2. Install dependencies
Bash

npm install
3. Environment variables
We keep a .env file in the repo since no sensitive secrets are used here.

Example .env (already included):

Code snippet

NODE_ENV=development
PORT=8888

# JWT
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1h

# Logging
LOG_LEVEL=info
LOG_DIR=logs
4. Run the server
Development (with nodemon):

Bash

npm run dev
Production:

Bash

npm start
The app will start on:
http://localhost:8888

API Documentation
Swagger (OpenAPI) is set up. Once the server is running, navigate to:

http://localhost:8888/api-docs

You can view and try all endpoints from the interactive docs.

Project Structure
.
├── config/
│   └── env.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── requestId.js
│   └── requireRole.js
├── models/
│   └── userModel.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── secretRoutes.js
├── utils/
│   ├── AppError.js
│   └── logger.js
├── logs/
├── problems.md
├── README.md
└── server.js
Logging
logs/combined.log → All logs.

logs/error.log → Errors only.

Every request has a unique ID for easier debugging.

Notes
Data is stored in memory only; restarting the server clears all users.

Passwords are hashed with bcrypt.

Cookies are HTTP-only.

The .env file is committed since no sensitive secrets are in use.