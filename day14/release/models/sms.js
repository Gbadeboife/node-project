const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Sms extends Model {}

Sms.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: [0, 255],
        }
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          
        }
      }
}, {
  sequelize,
  modelName: 'sms',
  timestamps: true,
  paranoid: true
});

module.exports = Sms;