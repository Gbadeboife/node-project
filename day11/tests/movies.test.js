const { ApolloServer } = require('apollo-server-express');
const { readFileSync } = require('fs');
const path = require('path');
const { setupTestDb, teardownTestDb } = require('./setup');
const models = require('../models');

const typeDefs = readFileSync(path.join(__dirname, '../types/schema.graphql'), 'utf8');
const resolvers = require('../resolvers');

describe('Movie GraphQL Operations', () => {
  let server;

  beforeAll(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: { models }
    });
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  it('should fetch all movies with their actors', async () => {
    const query = `
      query {
        movies {
          id
          title
          director {
            name
          }
          actors {
            name
          }
        }
      }
    `;

    const result = await server.executeOperation({ query });
    expect(result.errors).toBeUndefined();
    expect(result.data.movies).toHaveLength(1);
    expect(result.data.movies[0].actors).toHaveLength(1);
    expect(result.data.movies[0].actors[0].name).toBe('Test Actor');
  });

  it('should fetch movies with reviews greater than count', async () => {
    const query = `
      query {
        moviesWithReviewsGreaterThan(count: 0) {
          title
          reviews {
            notes
          }
        }
      }
    `;

    const result = await server.executeOperation({ query });
    expect(result.errors).toBeUndefined();
    expect(result.data.moviesWithReviewsGreaterThan).toHaveLength(1);
  });

  it('should add actor to movies by genre', async () => {
    const mutation = `
      mutation {
        addActorToMoviesByGenre(actorId: "1", genreName: "Action") {
          success
          message
        }
      }
    `;

    const result = await server.executeOperation({ query: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data.addActorToMoviesByGenre.success).toBe(true);
  });
}); 