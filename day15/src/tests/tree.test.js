const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Node = require('../models/Node');

describe('TreeQL API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Node.destroy({ where: {} });
  });

  describe('POST /api/v1/nodes', () => {
    it('should create a root node', async () => {
      const response = await request(app)
        .post('/api/v1/nodes')
        .send({
          name: 'Root',
          data: { description: 'Root node' }
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.node.name).toBe('Root');
      expect(response.body.data.node.parentId).toBeNull();
    });

    it('should create a child node', async () => {
      const root = await Node.create({ name: 'Root' });
      
      const response = await request(app)
        .post('/api/v1/nodes')
        .send({
          name: 'Child',
          parentId: root.id,
          data: { description: 'Child node' }
        });

      expect(response.status).toBe(201);
      expect(response.body.data.node.name).toBe('Child');
      expect(response.body.data.node.parentId).toBe(root.id);
    });

    it('should return 404 for non-existent parent', async () => {
      const response = await request(app)
        .post('/api/v1/nodes')
        .send({
          name: 'Child',
          parentId: 999,
          data: { description: 'Child node' }
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/v1/nodes/:id', () => {
    it('should get a node with its children', async () => {
      const root = await Node.create({ name: 'Root' });
      const child1 = await Node.create({ name: 'Child 1', parentId: root.id });
      const child2 = await Node.create({ name: 'Child 2', parentId: root.id });

      const response = await request(app)
        .get(`/api/v1/nodes/${root.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.node.name).toBe('Root');
      expect(response.body.data.node.children).toHaveLength(2);
    });

    it('should return 404 for non-existent node', async () => {
      const response = await request(app)
        .get('/api/v1/nodes/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/nodes/:id', () => {
    it('should update a node', async () => {
      const node = await Node.create({ name: 'Original' });

      const response = await request(app)
        .put(`/api/v1/nodes/${node.id}`)
        .send({
          name: 'Updated',
          data: { description: 'Updated node' }
        });

      expect(response.status).toBe(200);
      expect(response.body.data.node.name).toBe('Updated');
    });
  });

  describe('DELETE /api/v1/nodes/:id', () => {
    it('should delete a leaf node', async () => {
      const node = await Node.create({ name: 'Leaf' });

      const response = await request(app)
        .delete(`/api/v1/nodes/${node.id}`);

      expect(response.status).toBe(204);
    });

    it('should not delete a node with children', async () => {
      const root = await Node.create({ name: 'Root' });
      await Node.create({ name: 'Child', parentId: root.id });

      const response = await request(app)
        .delete(`/api/v1/nodes/${root.id}`);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/nodes/:id/move', () => {
    it('should move a node to a new parent', async () => {
      const oldParent = await Node.create({ name: 'Old Parent' });
      const newParent = await Node.create({ name: 'New Parent' });
      const node = await Node.create({ name: 'Node', parentId: oldParent.id });

      const response = await request(app)
        .post(`/api/v1/nodes/${node.id}/move`)
        .send({ newParentId: newParent.id });

      expect(response.status).toBe(200);
      expect(response.body.data.node.parentId).toBe(newParent.id);
    });

    it('should allow moving a node to root level', async () => {
      const parent = await Node.create({ name: 'Parent' });
      const node = await Node.create({ name: 'Node', parentId: parent.id });

      const response = await request(app)
        .post(`/api/v1/nodes/${node.id}/move`)
        .send({ newParentId: null });

      expect(response.status).toBe(200);
      expect(response.body.data.node.parentId).toBeNull();
    });
  });
}); 