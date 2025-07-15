module.exports = (sequelize, DataTypes) => {
  const Variable = sequelize.define(
    "variable",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,

    },
    {
      timestamps: true,
      tableName: "variable",
    },

  );

  return Variable;
};