const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// Route api/products

// Get all products
router.get("/", async (req, res) => {
  try {
    const getAllProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });

    if (!getAllProducts) {
      return res.status(404).json({ message: "No product found" });
    }

    return res.status(200).json({
      getAllProducts,
      message: "Product found successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get product by Id
router.get("/:id", async (req, res) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!singleProduct) {
      return res
        .status(404)
        .json({ message: "No product found, incorrect ID" });
    }

    return res.status(200).json({
      singleProduct,
      message: "Product found successfully by ID",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create product
router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json({
        product,
        message: "Product created successfully",
      });
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update product by ID
router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })

    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteProduct) {
      res.status(404).json({ message: "No product found with that id" });
      return;
    }

    res
      .status(200)
      .json({ deleteProduct, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
