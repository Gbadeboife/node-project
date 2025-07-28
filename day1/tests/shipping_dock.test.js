const request = require('supertest');
const app = require('../app');
const db = require('../models');

describe('Shipping Dock API', () => {
  beforeAll(async () => {
    await db.sequelize.authenticate();
  });

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('GET /api/v1/shipping_dock', () => {
    it('should return empty array when no docks exist', async () => {
      const response = await request(app).get('/api/v1/shipping_dock');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all docks', async () => {
      const testDock = await db.ShippingDock.create({
        name: 'Test Dock',
        status: 'active',
        capacity: 10
      });

      const response = await request(app).get('/api/v1/shipping_dock');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Dock');
    });
  });

  describe('POST /api/v1/shipping_dock', () => {
    it('should create new dock with valid data', async () => {
      const dockData = {
        name: 'New Dock',
        status: 'active',
        capacity: 15
      };

      const response = await request(app)
        .post('/api/v1/shipping_dock')
        .send(dockData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(dockData.name);
      expect(response.body.data.status).toBe(dockData.status);
      expect(response.body.data.capacity).toBe(dockData.capacity);
    });

    it('should return validation error with invalid data', async () => {
      const invalidData = {
        name: '', // Empty name should fail validation
        status: 'invalid-status',
        capacity: 0 // Should be at least 1
      };

      const response = await request(app)
        .post('/api/v1/shipping_dock')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/v1/shipping_dock/:id', () => {
    let testDock;

    beforeEach(async () => {
      testDock = await db.ShippingDock.create({
        name: 'Original Name',
        status: 'active',
        capacity: 10
      });
    });

    it('should update dock with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        status: 'maintenance',
        capacity: 20
      };

      const response = await request(app)
        .put(`/api/v1/shipping_dock/${testDock.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.capacity).toBe(updateData.capacity);
    });

    it('should return 404 for non-existent dock', async () => {
      const response = await request(app)
        .put('/api/v1/shipping_dock/999999')
        .send({ name: 'New Name', status: 'active', capacity: 10 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/shipping_dock/:id', () => {
    let testDock;

    beforeEach(async () => {
      testDock = await db.ShippingDock.create({
        name: 'To Delete',
        status: 'active',
        capacity: 10
      });
    });

    it('should delete existing dock', async () => {
      const response = await request(app)
        .delete(`/api/v1/shipping_dock/${testDock.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify dock is deleted
      const deletedDock = await db.ShippingDock.findByPk(testDock.id);
      expect(deletedDock).toBeNull();
    });

    it('should return 404 for non-existent dock', async () => {
      const response = await request(app)
        .delete('/api/v1/shipping_dock/999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
}); 