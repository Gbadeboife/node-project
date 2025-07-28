const { Op } = require('sequelize');

module.exports = async (parent, { count }, { models }) => {
  const movies = await models.Movie.findAll({
    include: [
      {
        model: models.Review,
        as: 'reviews'
      }
    ],
    having: models.sequelize.literal(`COUNT(reviews.id) > ${count}`),
    group: ['Movie.id']
  });

  return movies;
}; 