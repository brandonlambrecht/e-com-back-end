const router = require("express").Router();
const { Category, Product } = require("../../models");

// Route api/categories

// Get all categories
router.get("/", async (req, res) => {
  try {
    const getAllCategories = await Category.findAll({
      include: [{ model: Product }],
    });

    if (getAllCategories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json({
      getAllCategories,
      message: "Categories found successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get categories by ID
router.get("/:id", async (req, res) => {
  try {
    const getSingleCategory = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!getSingleCategory) {
      return res.status(404).json({ message: "No categories found by ID" });
    }

    return res.status(200).json({
      getSingleCategory,
      message: "Category found by ID successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create category
router.post("/", async (req, res) => {
  try {
    const createCategory = await Category.create(req.body);

    if (!createCategory) {
      return res.status(404).json({ message: "No category created" });
    }

    return res.status(200).json({
      createCategory,
      message: "Category created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const createCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });

    if (!createCategory) {
      return res.status(404).json({ message: "No category found by ID" });
    }

    return res.status(200).json({
      createCategory,
      message: "Category created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.findOneAndRemove(req.body, {
      where: { id: req.params.id },
    });

    if (!deleteCategory) {
      return res.status(404).json({ message: "Failed to delete category" });
    }

    return res.status(200).json({
      deleteCategory,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
