module.exports = (sequelize, DataTypes) => {
  // Define the MovieActor junction model for many-to-many relationship between movies and actors
  const MovieActor = sequelize.define('MovieActor', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Foreign key linking to the actor
    actor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Foreign key linking to the movie
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Use snake_case for table name and enable timestamps
    tableName: 'movie_actor',
    timestamps: true
  });

  // No associations needed as this is a junction table
  // The associations are defined in the Movie and Actor models

  return MovieActor;
}; 