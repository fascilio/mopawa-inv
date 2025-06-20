const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Warranty = sequelize.define('Warranty', {
  barcode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  clientType: {
    type: DataTypes.ENUM('Dealer', 'Retailer'),
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  registeredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  claimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  claimDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Warranty;
