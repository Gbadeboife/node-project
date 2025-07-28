const fs = require('fs');
const path = require('path');
const Model_builder = require('../Model_builder');

// Mock configuration for testing
const mockConfig = {
  model: [
    {
      name: 'test',
      field: [
        ['id', 'integer', 'ID', 'required'],
        ['name', 'string', 'Name', 'required']
      ]
    }
  ]
};

describe('Model_builder', () => {
  let builder;
  
  beforeEach(() => {
    // Mock fs.readFileSync for configuration
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify(mockConfig));
    
    // Mock fs.existsSync
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    
    // Mock fs.mkdirSync
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
    
    // Mock fs.writeFileSync
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    
    // Mock fs.readdirSync
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => []);
    
    // Mock fs.copyFileSync
    jest.spyOn(fs, 'copyFileSync').mockImplementation(() => {});
    
    builder = new Model_builder();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should load and validate configuration', () => {
      expect(builder.config).toEqual(mockConfig);
    });

    it('should throw error on invalid configuration', () => {
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => JSON.stringify({ invalid: true }));
      expect(() => new Model_builder()).toThrow('Configuration must contain a "model" array');
    });
  });

  describe('validateConfig', () => {
    it('should validate valid configuration', () => {
      expect(() => builder.validateConfig(mockConfig)).not.toThrow();
    });

    it('should throw error on missing model name', () => {
      const invalidConfig = {
        model: [{ field: [] }]
      };
      expect(() => builder.validateConfig(invalidConfig)).toThrow('Model at index 0 must have a name');
    });

    it('should throw error on invalid field format', () => {
      const invalidConfig = {
        model: [{
          name: 'test',
          field: [['invalid']]
        }]
      };
      expect(() => builder.validateConfig(invalidConfig))
        .toThrow('Field at index 0 in model "test" must be an array with 4 elements');
    });
  });

  describe('build', () => {
    it('should generate model files and copy initialize files', () => {
      builder.build();
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should handle errors during build process', () => {
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
        throw new Error('Failed to create directory');
      });
      expect(() => builder.build()).toThrow('Failed to create directory');
    });
  });
});
