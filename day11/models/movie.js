module.exports = (sequelize, DataTypes) => {
  // Define the Movie model with its attributes and options
  const Movie = sequelize.define('Movie', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Movie title - required field
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Foreign key linking to the director
    director_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Main genre of the movie
    main_genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Current status of the movie (e.g., Released, In Production)
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Optional review text for the movie
    review: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'movies',
    timestamps: true
  });

  // Define associations with other models
  Movie.associate = (models) => {
    // One-to-Many: Each movie belongs to one director
    Movie.belongsTo(models.Director, {
      foreignKey: 'director_id',
      as: 'director'
    });
    // One-to-Many: Each movie can have multiple reviews
    Movie.hasMany(models.Review, {
      foreignKey: 'movie_id',
      as: 'reviews'
    });
    // Many-to-Many: Movies can have multiple actors through movie_actor table
    Movie.belongsToMany(models.Actor, {
      through: models.MovieActor,
      foreignKey: 'movie_id',
      as: 'actors'
    });
    // Many-to-Many: Movies can have multiple genres through genre_movie table
    Movie.belongsToMany(models.Genre, {
      through: models.GenreMovie,
      foreignKey: 'movie_id',
      as: 'genres'
    });
  };

  return Movie;
}; 