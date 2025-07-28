const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Email extends Model {}

Email.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          
        }
      },
      email: {
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
  modelName: 'email',
  timestamps: true,
  paranoid: true
});

module.exports = Email;