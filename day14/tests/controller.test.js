const fs = require('fs').promises;
const path = require('path');
const ControllerBuilder = require('../src/builders/ControllerBuilder');

describe('ControllerBuilder', () => {
  const testConfig = {
    model: [
      {
        name: 'test',
        field: [
          ['id', 'integer', 'ID', 'required'],
          ['name', 'string', 'Name', 'required'],
          ['status', 'integer', 'Status', 'required']
        ]
      }
    ]
  };

  let controllerBuilder;
  const testOutputDir = path.join(__dirname, '../test-output/controllers');

  beforeAll(async () => {
    controllerBuilder = new ControllerBuilder(testConfig);
    controllerBuilder.outputDir = testOutputDir;
    
    // Create test output directory
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    // Cleanup test output directory
    await fs.rm(testOutputDir, { recursive: true, force: true });
  });

  test('should generate controller file with correct content', async () => {
    await controllerBuilder.build();

    const generatedFile = await fs.readFile(
      path.join(testOutputDir, 'testController.js'),
      'utf-8'
    );

    // Check if file contains essential parts
    expect(generatedFile).toContain('@swagger');
    expect(generatedFile).toContain('class TestController');
    expect(generatedFile).toContain('static async getAll');
    expect(generatedFile).toContain('static async getById');
    expect(generatedFile).toContain('static async create');
    expect(generatedFile).toContain('static async update');
    expect(generatedFile).toContain('static async delete');
    expect(generatedFile).toContain('transaction.commit()');
    expect(generatedFile).toContain('transaction.rollback()');
  });

  test('should handle invalid controller configuration', async () => {
    const invalidConfig = {
      model: [
        {
          name: 'invalid',
          field: null
        }
      ]
    };

    const invalidBuilder = new ControllerBuilder(invalidConfig);
    invalidBuilder.outputDir = testOutputDir;

    await expect(invalidBuilder.build()).rejects.toThrow();
  });

  test('should generate valid swagger documentation', async () => {
    const swaggerDocs = controllerBuilder.generateSwaggerDocs('Test', testConfig.model[0]);
    
    expect(swaggerDocs).toContain('@swagger');
    expect(swaggerDocs).toContain('components:');
    expect(swaggerDocs).toContain('schemas:');
    expect(swaggerDocs).toContain('Test:');
    expect(swaggerDocs).toContain('type: object');
    expect(swaggerDocs).toContain('properties:');
  });
}); 