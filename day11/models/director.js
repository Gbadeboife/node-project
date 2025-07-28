module.exports = (sequelize, DataTypes) => {
  // Define the Director model with its attributes and options
  const Director = sequelize.define('Director', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Director's full name - required field
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'directors',
    timestamps: true
  });

  // Define associations with other models
  Director.associate = (models) => {
    // One-to-Many: Each director can have multiple movies
    Director.hasMany(models.Movie, {
      foreignKey: 'director_id',
      as: 'movies'
    });
  };

  return Director;
}; 