import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import { validateUpdateProfile } from "../middleware/validation.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  validateUpdateProfile,
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        if (req.body.address) {
          user.address = { ...user.address, ...req.body.address };
        }

        const updatedUser = await user.save();
        res.json({
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            role: updatedUser.role,
            address: updatedUser.address,
            phone: updatedUser.phone,
          },
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

// Get orders for a specific user (Admin only)
router.get("/:userId/orders", authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

export default router;