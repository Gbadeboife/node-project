module.exports = (sequelize, DataTypes) => {
  const Rules = sequelize.define(
    "rules",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      condition: DataTypes.STRING,
      action: DataTypes.STRING,

    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "rules",
    },

  );

  return Rules;
};