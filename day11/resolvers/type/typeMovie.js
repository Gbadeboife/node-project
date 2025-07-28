module.exports = {
  Movie: {
    director: async (parent, args, { models }) => {
      return await models.Director.findByPk(parent.director_id);
    },
    reviews: async (parent, args, { models }) => {
      return await models.Review.findAll({
        where: { movie_id: parent.id }
      });
    },
    actors: async (parent, args, { models }) => {
      const movie = await models.Movie.findByPk(parent.id, {
        include: [{
          model: models.Actor,
          as: 'actors'
        }]
      });
      return movie.actors;
    },
    genres: async (parent, args, { models }) => {
      const movie = await models.Movie.findByPk(parent.id, {
        include: [{
          model: models.Genre,
          as: 'genres'
        }]
      });
      return movie.genres;
    }
  }
}; 