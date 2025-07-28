const { ValidationError } = require('../../core/errors');
const logger = require('../../core/logger');

module.exports = async (parent, { actorId, genreName }, { models }) => {
  // Start a database transaction
  const transaction = await models.sequelize.transaction();
  
  try {
    // Find the actor by ID
    const actor = await models.Actor.findByPk(actorId, { transaction });
    if (!actor) {
      throw new ValidationError('Actor not found');
    }

    // Find the genre by name
    const genre = await models.Genre.findOne({
      where: { name: genreName },
      transaction
    });

    if (!genre) {
      throw new ValidationError('Genre not found');
    }

    // Find all movies that belong to the specified genre
    const movies = await models.Movie.findAll({
      include: [{
        model: models.Genre,
        as: 'genres',
        where: { id: genre.id }
      }],
      transaction
    });

    // Add the actor to each movie found
    for (const movie of movies) {
      // Use findOrCreate to prevent duplicate entries
      await models.MovieActor.findOrCreate({
        where: {
          movie_id: movie.id,
          actor_id: actorId
        },
        transaction
      });
    }

    // Commit the transaction if everything succeeded
    await transaction.commit();
    logger.info(`Actor ${actorId} added to ${movies.length} movies with genre ${genreName}`);

    return {
      success: true,
      message: `Actor added to ${movies.length} movies with genre ${genreName}`
    };
  } catch (error) {
    // Rollback the transaction if any error occurred
    await transaction.rollback();
    logger.error('Failed to add actor to movies:', error);
    
    return {
      success: false,
      message: 'Failed to add actor to movies',
      errors: [{
        path: 'internal',
        message: error.message
      }]
    };
  }
}; 