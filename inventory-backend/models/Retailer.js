const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Retailer = sequelize.define('Retailer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isTeamLeader: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  teamLeaderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Retailer;
