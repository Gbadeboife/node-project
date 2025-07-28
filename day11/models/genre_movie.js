module.exports = (sequelize, DataTypes) => {
  // Define the GenreMovie junction model for many-to-many relationship between genres and movies
  const GenreMovie = sequelize.define('GenreMovie', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Foreign key linking to the movie
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Foreign key linking to the genre
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Use snake_case for table name and enable timestamps
    tableName: 'genre_movie',
    timestamps: true
  });

  // No associations needed as this is a junction table
  // The associations are defined in the Movie and Genre models

  return GenreMovie;
}; 