'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movie_actor', {
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
      actor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'actors',
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

    // Add unique constraint to prevent duplicate movie-actor pairs
    await queryInterface.addIndex('movie_actor', ['movie_id', 'actor_id'], {
      unique: true,
      name: 'movie_actor_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movie_actor');
  }
}; 