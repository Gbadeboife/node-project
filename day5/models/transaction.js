const { DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shipping_dock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER, // 0 = not paid, 1 = paid
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'transactions',
  timestamps: true,
});

module.exports = Transaction;