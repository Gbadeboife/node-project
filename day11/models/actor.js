module.exports = (sequelize, DataTypes) => {
  // Define the Actor model with its attributes and options
  const Actor = sequelize.define('Actor', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Actor's full name - required field
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'actors',
    timestamps: true
  });

  // Define associations with other models
  Actor.associate = (models) => {
    // Many-to-Many: Actors can be in multiple movies through movie_actor table
    Actor.belongsToMany(models.Movie, {
      through: models.MovieActor,
      foreignKey: 'actor_id',
      as: 'movies'
    });
  };

  return Actor;
}; 