const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ReturnedProduct = sequelize.define('ReturnedProduct', {
  dealerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = ReturnedProduct;
