module.exports = (sequelize, DataTypes) => {
  const ShippingDock = sequelize.define('ShippingDock', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isIn: [[0, 1]] } // 0: inactive, 1: active
    }
  }, {
    tableName: 'shipping_dock',
    timestamps: false
  });
  return ShippingDock;
}; 