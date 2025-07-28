const { ValidationError } = require('../../core/errors');
const logger = require('../../core/logger');

module.exports = async (parent, { minReviews }, { models }) => {
  try {
    // Validate input
    if (minReviews < 0) {
      throw new ValidationError('Review count must be a non-negative number');
    }

    // Find movies with review count greater than minReviews
    const movies = await models.Movie.findAll({
      include: [{
        model: models.Review,
        as: 'reviews',
        attributes: ['id'] // Only fetch IDs for counting
      }],
      having: models.sequelize.literal(`COUNT(reviews.id) > ${minReviews}`),
      group: ['Movie.id'],
      subQuery: false // Optimize query performance
    });

    logger.info(`Found ${movies.length} movies with more than ${minReviews} reviews`);
    return movies;
  } catch (error) {
    logger.error('Error fetching movies by review count:', error);
    throw error;
  }
}; 