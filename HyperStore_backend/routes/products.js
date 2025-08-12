import express from "express"
import Product from "../models/Product.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all products with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    let query = Product.find({ isActive: true }).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const products = await query.exec();
    const total = await Product.countDocuments({ isActive: true });

    res.json({
      products,
      total,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ message: "Server error fetching product" })
  }
})


router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ message: "Server error creating product" })
  }
})





export default router
