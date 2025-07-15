module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('email', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER, // 0: inactive, 1: active
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'email',
    timestamps: false,
  });
  return Email;
}; 