const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: [0, 255],
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
  modelName: 'user',
  timestamps: true,
  paranoid: true
});

module.exports = User;