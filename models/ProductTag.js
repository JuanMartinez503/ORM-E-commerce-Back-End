const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    //creates tags and references other tables
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
    },
    product_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'product',
        key: 'id'
      }
    },
    //the table makes a reference to the tag table
    tag_id:{
      type:DataTypes.INTEGER,
      references:{
        model:'tag',
        key:'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
