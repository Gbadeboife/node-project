module.exports = async (parent, args, { models }) => {
  return await models.Movie.findAll({
    include: [
      {
        model: models.Actor,
        as: 'actors'
      },
      {
        model: models.Director,
        as: 'director'
      },
      {
        model: models.Review,
        as: 'reviews'
      },
      {
        model: models.Genre,
        as: 'genres'
      }
    ]
  });
}; 