const request = require('supertest');
const app = require('../src/app');
const { Node } = require('../src/models');

/**
 * Test suite for the TreeQL API endpoints
 */
describe('Node API Endpoints', () => {
  let rootNode;

  beforeEach(async () => {
    // Clear the database before each test
    await Node.destroy({ where: {}, force: true });

    // Create a root node for testing
    rootNode = await Node.create({
      name: 'Root Node',
      data: { description: 'Root node for testing' }
    });
  });

  describe('POST /api/v1/nodes', () => {
    it('should create a new node', async () => {
      const response = await request(app)
        .post('/api/v1/nodes')
        .send({
          name: 'Child Node',
          parentId: rootNode.id,
          data: { description: 'This is a child node' }
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.node.name).toBe('Child Node');
      expect(response.body.data.node.parentId).toBe(rootNode.id);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/nodes')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
    });

    it('should return 404 for non-existent parent', async () => {
      const response = await request(app)
        .post('/api/v1/nodes')
        .send({
          name: 'Child Node',
          parentId: 99999,
          data: { description: 'This is a child node' }
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/nodes/:id', () => {
    it('should get a node and its children', async () => {
      const child = await Node.create({
        name: 'Child Node',
        parentId: rootNode.id
      });

      const response = await request(app)
        .get(`/api/v1/nodes/${rootNode.id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.node.id).toBe(rootNode.id);
      expect(response.body.data.node.children).toHaveLength(1);
      expect(response.body.data.node.children[0].id).toBe(child.id);
    });

    it('should return 404 for non-existent node', async () => {
      const response = await request(app)
        .get('/api/v1/nodes/99999');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('PUT /api/v1/nodes/:id', () => {
    it('should update a node', async () => {
      const response = await request(app)
        .put(`/api/v1/nodes/${rootNode.id}`)
        .send({
          name: 'Updated Root Node',
          data: { description: 'Updated description' }
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.node.name).toBe('Updated Root Node');
      expect(response.body.data.node.data.description).toBe('Updated description');
    });

    it('should validate update data', async () => {
      const response = await request(app)
        .put(`/api/v1/nodes/${rootNode.id}`)
        .send({
          name: '' // invalid empty name
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('DELETE /api/v1/nodes/:id', () => {
    it('should delete a node and its children', async () => {
      // Create a child node
      await Node.create({
        name: 'Child Node',
        parentId: rootNode.id
      });

      const response = await request(app)
        .delete(`/api/v1/nodes/${rootNode.id}`);

      expect(response.status).toBe(204);

      // Verify node is deleted
      const deletedNode = await Node.findByPk(rootNode.id);
      expect(deletedNode).toBeNull();
    });

    it('should return 404 for non-existent node', async () => {
      const response = await request(app)
        .delete('/api/v1/nodes/99999');

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/nodes/:id/move', () => {
    it('should move a node to a new parent', async () => {
      // Create a new parent node
      const newParent = await Node.create({
        name: 'New Parent Node'
      });

      const response = await request(app)
        .post(`/api/v1/nodes/${rootNode.id}/move`)
        .send({
          newParentId: newParent.id
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.node.parentId).toBe(newParent.id);
    });

    it('should prevent circular references', async () => {
      // Create a child node
      const child = await Node.create({
        name: 'Child Node',
        parentId: rootNode.id
      });

      // Try to move parent under child
      const response = await request(app)
        .post(`/api/v1/nodes/${rootNode.id}/move`)
        .send({
          newParentId: child.id
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toMatch(/circular/i);
    });
  });
});
