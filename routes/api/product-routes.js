const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const productsData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag, as:'products' }],
      //this is where the models are connected
    });
    res.status(200).json(productsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'products' }],
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
    } else {
      res.status(200).json(productData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tagId) => {
        return {
          product_id: product.id,
          tag_id: tagId,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const productData = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (!productData[0]) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      await ProductTag.destroy({
        where: { id: productTags.map(({ id }) => id) },
      });

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id },
    });
    if (productData[0]) {
      res.status(404).json({ message: 'No product found with this id!' });
    } else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
