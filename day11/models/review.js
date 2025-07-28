module.exports = (sequelize, DataTypes) => {
  // Define the Review model with its attributes and options
  const Review = sequelize.define('Review', {
    // Primary key with auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Review content/notes - required field
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // Foreign key linking to the movie being reviewed
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'reviews',
    timestamps: true
  });

  // Define associations with other models
  Review.associate = (models) => {
    // Many-to-One: Each review belongs to one movie
    Review.belongsTo(models.Movie, {
      foreignKey: 'movie_id',
      as: 'movie'
    });
  };

  return Review;
}; 