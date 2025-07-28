const { sequelize } = require('../models');

beforeAll(async () => {
  // Sync database tables
  await sequelize.sync({ force: true });
  
  // Create test data
  await createTestData();
});

const createTestData = async () => {
  // Create test data
  const director = await sequelize.models.Director.create({
    name: 'Test Director'
  });
  
  const movie = await sequelize.models.Movie.create({
    title: 'Test Movie',
    director_id: director.id,
    main_genre: 'Action',
    status: 'Released',
    review: 'Great movie!'
  });
  
  const actor = await sequelize.models.Actor.create({
    name: 'Test Actor'
  });
  
  const genre = await sequelize.models.Genre.create({
    name: 'Action'
  });
  
  await sequelize.models.MovieActor.create({
    movie_id: movie.id,
    actor_id: actor.id
  });
  
  await sequelize.models.GenreMovie.create({
    movie_id: movie.id,
    genre_id: genre.id
  });
  
  await sequelize.models.Review.create({
    notes: 'Test Review',
    movie_id: movie.id
  });
};

const teardownTestDb = async () => {
  await sequelize.drop();
};

module.exports = {
  setupTestDb,
  teardownTestDb
}; 