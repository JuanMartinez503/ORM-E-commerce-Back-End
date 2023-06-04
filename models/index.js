// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE', // Update the foreign key constraint to set it to ON DELETE SET NULL
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE', // Update the foreign key constraint to set it to ON DELETE CASCADE
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  //the tables below get linked 
  through: {
    model: ProductTag,
    unique: false,
  },
  as: 'products',
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false,
  },
  as: 'tags_of_product',
});
//this is where the files get exported
module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
