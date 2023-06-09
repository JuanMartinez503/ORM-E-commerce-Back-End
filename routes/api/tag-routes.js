const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  //this gets all of the tags
  // find all tags
  try {
    const tagsData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: "tags_of_product" }],
    });
    // be sure to include its associated Product data
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagsData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: "tags_of_product" }],
    });
    if (!tagsData) {
      res.status(404).json({ message: "No tag found with this id!" });
    } else {
      res.status(200).json(tagsData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// be sure to include its associated Product data

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tagsData = await Tag.create(req.body);
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagsData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagsData[0]) {
      res.status(404).json({ message: "No tag found with this id!" });
    } else {
      res.status(200).json(tagsData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagsData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagsData) {
      //if there is no id found a message will pop out
      res.status(404).json({ message: "No tag found with this id!" });
    } else {
      res.status(200).json(tagsData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
