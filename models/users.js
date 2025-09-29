import bcrypt from "bcryptjs";

// User data store (in-memory database)
let users = [
  {
    id: "1",
    email: "admin@test.com",
    password: bcrypt.hashSync("Admin@12345", 10),
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01").toISOString()
  },
  {
    id: "2",
    email: "user@test.com",
    password: bcrypt.hashSync("User@12345", 10),
    name: "Regular User",
    role: "user",
    createdAt: new Date("2024-01-02").toISOString()
  }
];

export default users;
