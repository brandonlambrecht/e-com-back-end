const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// Route /api/tags

router.get("/", async (req, res) => {
  try {
    const getAllTags = await Tag.findAll({
      include: [{ model: Product }],
    });

    if (!getAllTags) {
      res.status(404).json({ message: "No tag with that ID" });
      return;
    }

    res
      .status(200)
      .json({ getAllTags, message: "All tags found successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Find tag by Id
router.get("/:id", async (req, res) => {
  try {
    const getSingleTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!getSingleTag) {
      res.status(404).json({ message: "No tag with that ID" });
      return;
    }

    res
      .status(200)
      .json({ getSingleTag, message: "Tag found with ID successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create new tag
router.post("/", async (req, res) => {
  try {
    const createTag = await Tag.create({
      tag_name: req.body.tag_name,
    });

    if (!createTag) {
      res.status(404).json({ message: "Tag not created!" });
      return;
    }

    res.status(200).json({ createTag, message: "Tag created successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update tag by ID
router.put("/:id", async (req, res) => {
  try {
    const updateTag = await Tag.update(
      { tag_name: req.body.tag_name },
      {
        where: { id: req.params.id },
      }
    );

    if (!updateTag) {
      res.status(404).json({ message: "No tag with that ID" });
      return;
    }

    res.status(200).json({ updateTag, message: "Tag found with that ID" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteTag) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    res.status(200).json({ deleteTag, message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
