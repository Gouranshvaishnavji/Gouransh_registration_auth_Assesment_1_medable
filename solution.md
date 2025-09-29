# Development Journal & Thought Process

This document is my personal log of how I worked through the project. I’ve tried to capture the actual problems I ran into, what I was thinking at the time, and how I solved them.

---

## Environment Setup

At the start, I noticed the JWT secret and other sensitive values were written directly in the code.

> My first thought was: what if I need to change the key later or move the app to another machine? I’d have to change it in multiple places. That’s messy and insecure.

So I moved everything into a `.env` file and created an `env.js` wrapper to centralize access. This way I only use `env.JWT_SECRET` instead of sprinkling `process.env` calls everywhere. It's a cleaner and safer approach.

---

## Error Handling

Early on, I saw too many `try/catch` blocks inside the routes. It felt repetitive and hard to maintain.

> My thought process was: there has to be a single place where I can deal with errors instead of cluttering every controller.

That led me to create a **global errorHandler middleware** and a custom `AppError` class. With this, I can just call `next(new AppError("message", 400))` and not worry about sending the response. The middleware takes care of formatting the error consistently.

---

## Authentication and Authorization

The boilerplate code had a weird flow where it issued JWT tokens even on registration.

> Normally, I would only issue a token on login. I debated whether to change it but decided to stick closer to best practices: register only creates the account, login generates the token.

I also found that every new user was being assigned the `"user"` role, hardcoded. That felt wrong because it meant there was no real role validation. I adjusted it so `"user"` is the default role, but added checks so only an admin can promote someone else.

---

## Input Validation

There was no validation at all.

> I imagined a scenario where someone could register with an email like "123" or a password like "pass". That would break everything later.

I brought in **Joi** to enforce rules: valid email, password with length and complexity requirements, and max limits to avoid injection attempts. This immediately made the API more trustworthy.

---

## User Data Management

The `users` array was duplicated in multiple files.

> That made me think: what happens if I add a user in one file and not the other? It would cause desynchronization.

I created a single `userModel.js` to hold the in-memory data. That became the central source of truth. From then on, all controllers imported from that file.

Another thing was passwords showing up in API responses.

> I pictured calling `/api/users` and seeing everyone’s hashed password. That’s a big no.

So I filtered out the `password` field in every response.

---

## Middleware Choices

Originally, the routes used URL parameters like `/api/users/:id` to update or delete a user.

> I realized this could be abused: if I log in as user A but know user B’s ID, I could hit `/api/users/B` and modify their account.

To prevent this, I switched to using `res.locals.user` populated by the auth middleware. Now the server trusts the token and knows which user is making the request, without relying on IDs in the URL. This change made the routes much safer.

I also added some new middlewares:
* **`authMiddleware`**: Verifies JWTs and puts the user in `res.locals`.
* **`requireRole`**: Enforces role-based access (admin-only routes).
* **`requestIdMiddleware`**: Tags every request with a unique ID so I can trace it in the logs.

---

## Logging with Winston

During testing, I noticed that using `console.log` was not enough.

> Once multiple requests came in, I couldn’t tell which log belonged to which request. I also thought about what would happen in production: console logs disappear, no history is saved.

That’s why I added **Winston**. I set up two files: `combined.log` for all logs and `error.log` for errors. I also integrated request IDs so every log entry can be traced back to a specific request. Now if something fails, I know exactly what happened and when.

---

## Secret Puzzle Endpoint

The `/api/users/secret-stats` endpoint was completely open. Anyone could hit it and see the secret message.

> That didn’t fit the idea of a hidden puzzle.

I fixed it by requiring both the puzzle condition (special header or query param) and an authenticated admin role. Now, just guessing the header is not enough—you have to actually log in as an admin. That felt more in line with the challenge.

---

## Swagger Documentation

Since part of the assessment asked for documentation, I started adding Swagger-style comments.

> The key thought was: the docs should tell future developers exactly what each route expects and returns without diving into the code. That way the project feels complete and professional.

I picked **OpenAPI** because it’s easier to maintain by annotating the code directly.

---

## Current Progress

So far I’ve managed to:

- [x] Move sensitive values into `.env` and modularize with `env.js`.
- [x] Centralize user data into one model.
- [x] Implement proper JWT authentication and authorization.
- [x] Add input validation with **Joi**.
- [x] Create global error handling with a custom error class.
- [x] Switch from URL params to `res.locals.user` for security.
- [x] Add **Winston** logging with request IDs.
- [x] Secure the secret puzzle endpoint.
- [x] Start adding **Swagger** docs.
