const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Dealer = sequelize.define('Dealer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parentDealerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Dealer;
