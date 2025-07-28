module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define(
    "result",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "result",
    }
  );
  Result.associate = (models) => {
    Result.belongsTo(models.quiz, { foreignKey: 'quiz_id', as: 'quiz' });
  };
  return Result;
}; 