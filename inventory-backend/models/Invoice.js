const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Invoice = sequelize.define('Invoice', {
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customerType: {
    type: DataTypes.ENUM('Dealer', 'Retailer', 'Sample', 'gift'),
    allowNull: true
  },
  customerId: {
    type: DataTypes.INTEGER, // Replace with foreign key if needed
    allowNull: true
  },
  totalItems: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Invoice;
