module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    "Location",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      created_at: DataTypes.DATEONLY,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "location",
    },
    {
      underscoredAll: false,
      underscored: false,
    }
  );

  return Location;
};