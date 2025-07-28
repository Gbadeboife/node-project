'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add directors
    const directors = await queryInterface.bulkInsert('directors', [
      { name: 'Steven Spielberg' },
      { name: 'Christopher Nolan' },
      { name: 'Martin Scorsese' }
    ], { returning: true });

    // Add movies
    const movies = await queryInterface.bulkInsert('movies', [
      {
        title: 'Jurassic Park',
        director_id: 1,
        main_genre: 'Science Fiction',
        status: 'Released',
        review: 'Classic dinosaur movie'
      },
      {
        title: 'Inception',
        director_id: 2,
        main_genre: 'Science Fiction',
        status: 'Released',
        review: 'Mind-bending thriller'
      },
      {
        title: 'The Departed',
        director_id: 3,
        main_genre: 'Crime',
        status: 'Released',
        review: 'Intense crime drama'
      }
    ], { returning: true });

    // Add actors
    const actors = await queryInterface.bulkInsert('actors', [
      { name: 'Sam Neill' },
      { name: 'Leonardo DiCaprio' },
      { name: 'Matt Damon' }
    ], { returning: true });

    // Add genres
    const genres = await queryInterface.bulkInsert('genres', [
      { name: 'Science Fiction' },
      { name: 'Action' },
      { name: 'Crime' },
      { name: 'Drama' }
    ], { returning: true });

    // Add movie-actor relationships
    await queryInterface.bulkInsert('movie_actor', [
      { movie_id: 1, actor_id: 1 }, // Jurassic Park - Sam Neill
      { movie_id: 2, actor_id: 2 }, // Inception - Leonardo DiCaprio
      { movie_id: 3, actor_id: 2 }, // The Departed - Leonardo DiCaprio
      { movie_id: 3, actor_id: 3 }  // The Departed - Matt Damon
    ]);

    // Add genre-movie relationships
    await queryInterface.bulkInsert('genre_movie', [
      { movie_id: 1, genre_id: 1 }, // Jurassic Park - Science Fiction
      { movie_id: 1, genre_id: 2 }, // Jurassic Park - Action
      { movie_id: 2, genre_id: 1 }, // Inception - Science Fiction
      { movie_id: 2, genre_id: 2 }, // Inception - Action
      { movie_id: 3, genre_id: 3 }, // The Departed - Crime
      { movie_id: 3, genre_id: 4 }  // The Departed - Drama
    ]);

    // Add reviews
    await queryInterface.bulkInsert('reviews', [
      {
        notes: 'Groundbreaking special effects',
        movie_id: 1
      },
      {
        notes: 'Complex and rewatchable',
        movie_id: 2
      },
      {
        notes: 'Outstanding performances',
        movie_id: 3
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('genre_movie', null, {});
    await queryInterface.bulkDelete('movie_actor', null, {});
    await queryInterface.bulkDelete('genres', null, {});
    await queryInterface.bulkDelete('actors', null, {});
    await queryInterface.bulkDelete('movies', null, {});
    await queryInterface.bulkDelete('directors', null, {});
  }
}; 