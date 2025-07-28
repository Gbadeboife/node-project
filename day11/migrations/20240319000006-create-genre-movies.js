'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('genre_movie', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'movies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'genres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to prevent duplicate genre-movie pairs
    await queryInterface.addIndex('genre_movie', ['movie_id', 'genre_id'], {
      unique: true,
      name: 'genre_movie_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('genre_movie');
  }
}; 