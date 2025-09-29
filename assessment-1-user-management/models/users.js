 // made sure this is bcrypt-hashed
const users = [
  {
    id: "1",
    email: "admin@test.com",
    password: "$2a$10$hashedAdminPasswordHere",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@test.com",
    password: "$2a$10$hashedUserPasswordHere",
    name: "Regular User",
    role: "user",
    createdAt: new Date().toISOString(),
  },
];

export default users;