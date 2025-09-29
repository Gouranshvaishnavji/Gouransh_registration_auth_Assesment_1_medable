import bcrypt from "bcryptjs";
import users from "../../models/users.js";
import AppError from "../../utils/AppError.js";

// Get all users (admin only)
export const getAllUsers = (req, res, next) => {
  try {
    res.set({
      "X-Total-Users": users.length.toString(),
      "X-Secret-Endpoint": "/api/users/secret-stats" // puzzle hint
    });

    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt
      }))
    });
  } catch (err) {
    next(new AppError("Failed to fetch users", 500));
  }
};

// Get single user
export const getUserById = (req, res, next) => {
  try {
    const  userId  = res.locals.user.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (err) {
    next(new AppError("Failed to fetch user", 500));
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const  userId  = req.locals.user.id;
    const updateData = req.body;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return next(new AppError("User not found", 404));

    // Hash new password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    users[userIndex] = { ...users[userIndex], ...updateData };

    const { id, email, name, role, createdAt } = users[userIndex];
    res.json({
      message: "User updated successfully",
      user: { id, email, name, role, createdAt }
    });
  } catch (err) {
    next(new AppError("Failed to update user", 500));
  }
};

// Delete user
export const deleteUser = (req, res, next) => {
  try {
    const  userId  = req.locals.user.id;

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return next(new AppError("User not found", 404));

    // Prevent self-deletion
    if (users[userIndex].id === req.user.id) {
      return next(new AppError("You cannot delete your own account", 400));
    }

    users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(new AppError("Failed to delete user", 500));
  }
};
