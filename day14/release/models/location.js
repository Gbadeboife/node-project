const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Location extends Model {}

Location.init({
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
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          
        }
      }
}, {
  sequelize,
  modelName: 'location',
  timestamps: true,
  paranoid: true
});

module.exports = Location;