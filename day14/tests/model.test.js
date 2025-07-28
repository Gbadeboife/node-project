const fs = require('fs').promises;
const path = require('path');
const ModelBuilder = require('../src/builders/ModelBuilder');

describe('ModelBuilder', () => {
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

  let modelBuilder;
  const testOutputDir = path.join(__dirname, '../test-output/models');

  beforeAll(async () => {
    modelBuilder = new ModelBuilder(testConfig);
    modelBuilder.outputDir = testOutputDir;
    
    // Create test output directory
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    // Cleanup test output directory
    await fs.rm(testOutputDir, { recursive: true, force: true });
  });

  test('should generate model file with correct content', async () => {
    await modelBuilder.build();

    const generatedFile = await fs.readFile(
      path.join(testOutputDir, 'test.js'),
      'utf-8'
    );

    // Check if file contains essential parts
    expect(generatedFile).toContain('const { Model, DataTypes } = require(\'sequelize\')');
    expect(generatedFile).toContain('class Test extends Model {}');
    expect(generatedFile).toContain('id: {');
    expect(generatedFile).toContain('name: {');
    expect(generatedFile).toContain('status: {');
    expect(generatedFile).toContain('type: DataTypes.INTEGER');
    expect(generatedFile).toContain('type: DataTypes.STRING');
  });

  test('should handle invalid model configuration', async () => {
    const invalidConfig = {
      model: [
        {
          name: 'invalid',
          field: null
        }
      ]
    };

    const invalidBuilder = new ModelBuilder(invalidConfig);
    invalidBuilder.outputDir = testOutputDir;

    await expect(invalidBuilder.build()).rejects.toThrow();
  });
}); 