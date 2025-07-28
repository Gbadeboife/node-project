module.exports = (sequelize, DataTypes) => {
  // Define the Genre model with its attributes and options
  const Genre = sequelize.define('Genre', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Genre name (e.g., Action, Drama, Comedy) - required field
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'genres',
    timestamps: true
  });

  // Define associations with other models
  Genre.associate = (models) => {
    // Many-to-Many: Genres can be associated with multiple movies through genre_movie table
    Genre.belongsToMany(models.Movie, {
      through: models.GenreMovie,
      foreignKey: 'genre_id',
      as: 'movies'
    });
  };

  return Genre;
}; 