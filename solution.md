# Project Decision & Progress Log

This document outlines the key problems identified in the initial boilerplate code and the corresponding solutions and architectural decisions made during development.

---

## 1. Handling Sensitive Information
* **Problem:** The boilerplate code had hardcoded secrets like the JWT secret, posing a significant security risk.
* **Solution:** I created an `env.js` file to centralize and load all environment variables using `process.env`. This ensures no secrets are committed to version control. While `process.env` could be used directly, the `env.js` module provides a cleaner, more organized approach.

---

## 2. Centralizing Error Handling
* **Problem:** Each controller was cluttered with individual `try/catch` blocks, leading to repetitive and messy code.
* **Solution:** I implemented a **global error handler middleware** and a custom `AppError` class. Now, controllers are much cleaner—they simply `throw new AppError(...)` and the middleware handles the logic of formatting and sending the final error response.
* _**Note:** It was crucial to place the error handling middleware at the very end of the middleware chain in `server.js`, after all the routes have been defined._

---

## 3. Clarifying `AppError` vs. `errorHandler`
* **Problem:** I was initially confused about the distinct roles of the `AppError` class and the `errorHandler` middleware.
* **Solution:** I clarified that the `AppError` class is a blueprint for **creating** custom, operational errors with attached status codes. The `errorHandler` is the **middleware** responsible for **catching** these specific errors and processing them into a consistent JSON response for the client.

---

## 4. Centralizing the Data Model
* **Problem:** The initial code had the `users` array duplicated across multiple files, violating the "single source of truth" principle.
* **Solution:** I created a single `models/users.js` file to act as a centralized, in-memory database. All controllers now import user data from this one location. I also preloaded it with one admin and one regular user for testing purposes.

---

## 5. Secure Role Assignment
* **Problem:** The boilerplate hardcoded the user role. Allowing users to assign their own role during registration would be a major security flaw.
* **Solution:** My implementation ensures that the registration endpoint **always** assigns the role of `"user"` by default. The `admin` role is reserved for predefined accounts in the data model, preventing privilege escalation.

---

## 6. Implementing Input Validation
* **Problem:** The API lacked any validation for incoming data like emails or passwords.
* **Solution:** I integrated the **Joi** library to create robust validation schemas with the following rules:
    * **Password:** Minimum 8 characters, requiring at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
    * **Email:** Must be a valid email format.
    * **Name:** Optional, between 2 and 50 characters.
* _**Note:** I also created a reusable `validate.js` middleware to ensure validation logic runs cleanly before the main controller logic is executed._

---

## 7. Preventing Password Exposure
* **Problem:** API responses were leaking sensitive user data by including the hashed password.
* **Solution:** Before sending any user object in a response, I strip out the password using object destructuring:
    ```javascript
    const { password: _, ...safeUser } = newUser;
    res.json(safeUser);
    ```

---

## 8. API Documentation with Swagger
* **Problem:** The project required comprehensive API documentation.
* **Solution:** I added **Swagger** using `swagger-ui-express` and `swagger-jsdoc`. I created a central Swagger configuration file and hooked the interactive UI into the `/api/docs` endpoint. I have begun annotating routes with JSDoc comments to auto-generate the documentation.

---

## 9. JWT/Cookie Strategy for Registration vs. Login
* **Problem:** I was unsure whether a JWT cookie should be set immediately upon registration or only after a successful login.
* **Solution:** I determined the correct and more secure flow is to **only set the cookie upon login**. Registration's purpose is to create an account; Login's purpose is to verify identity and establish a session.

---

## ✅ Tasks Completed So Far
- [x] Moved all sensitive information to a secure `.env` configuration.
- [x] Set up a custom `AppError` class and a global error handling middleware.
- [x] Centralized the user data into a single model file.
- [x] Implemented a secure default role assignment for new users.
- [x] Fixed the password leak in all relevant API responses.
- [x] Added strong, schema-based input validation using Joi.
- [x] Integrated a Swagger documentation endpoint at `/api/docs`.
- [x] Designed and completed the secure user registration flow.