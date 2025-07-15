module.exports = (sequelize, DataTypes) => {
  const Rule = sequelize.define(
    "rule",
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
      tableName: "rule",
    },

  );

  return Rule;
};