module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define(
    "quiz",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "quiz",
    }
  );
  Quiz.associate = (models) => {
    Quiz.hasMany(models.question, { foreignKey: 'quiz_id', as: 'questions' });
  };
  return Quiz;
}; 