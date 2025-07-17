const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User; 