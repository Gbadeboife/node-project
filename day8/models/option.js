module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define(
    "option",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: "option",
    }
  );
  Option.associate = (models) => {
    Option.belongsTo(models.question, { foreignKey: 'question_id', as: 'question' });
  };
  return Option;
}; 