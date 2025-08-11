import express from "express"
import Product from "../models/Product.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all products with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    // Base query to get all active products, sorted by creation date
    let query = Product.find({ isActive: true }).sort({ createdAt: -1 });

    // If a limit is provided, apply it to the query
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const products = await query.exec();
    const total = await Product.countDocuments({ isActive: true });

    // Return the products and total count
    res.json({
      products,
      total,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// Get single product
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

// Create product (Admin only)
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

// Update product (Admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error updating product" })
  }
})

// Delete product (Admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error deleting product" })
  }
})

// Get categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true })
    res.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Server error fetching categories" })
  }
})

export default router
