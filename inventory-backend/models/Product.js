const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product = sequelize.define('Product', {
  barcode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'good', 'bad', 'assigned'),
    defaultValue: 'pending',
  },
  category: {
    type: DataTypes.ENUM('dealer', 'retail', 'sample', 'gift'),
    allowNull: true,
  },
  dealerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wasUnderMaintenance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assignedType: {
    type: DataTypes.ENUM('Dealer', 'Retailer', 'Sample', 'Gift'),
    allowNull: true,
  },
  assignmentType: {
    type: DataTypes.ENUM('Dealer', 'Retailer', 'Sample', 'Gift'),
    allowNull: true,
  },
  assignmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  assignmentDate: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Product;
