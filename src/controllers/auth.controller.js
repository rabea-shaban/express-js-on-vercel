const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//* ================= REGISTER ================= */

const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // normalize data
    email = email?.toLowerCase().trim();
    role = role?.trim();

    // validation بسيطة
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // default role
    if (!role) role = "user";

    // allow only specific roles
    const allowedRoles = ["admin", "user"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Register failed",
      error: error.message,
    });
  }
};

//* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.toLowerCase().trim();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(), // 🔥 مهم جدًا
        role: user.role,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

//*================= Get Profile User ===================    */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting profile",
      error: error.message,
    });
  }
};

//*=========== Update Profile User and password ===================    */
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If email is being updated, check if it's already taken
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};
//* ================= EXPORTS ================= */
module.exports = {
  register,
  login,

  getProfile,
  updateProfile,
};
