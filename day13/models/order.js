'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  
  Order.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stripe_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('paid', 'failed'),
      allowNull: false,
      defaultValue: 'paid'
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  
  return Order;
}; 