module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "question",
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
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "question",
    }
  );
  Question.associate = (models) => {
    Question.belongsTo(models.quiz, { foreignKey: 'quiz_id', as: 'quiz' });
    Question.hasMany(models.option, { foreignKey: 'question_id', as: 'options' });
  };
  return Question;
}; 