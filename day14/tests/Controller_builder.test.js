const Controller_builder = require('../src/builders/Controller_builder');
const fs = require('fs');
const path = require('path');

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

describe('Controller_builder', () => {
  let builder;

  beforeEach(() => {
    builder = new Controller_builder(mockConfig);
  });

  test('should create controller files for each model', async () => {
    // Mock fs methods
    jest.spyOn(fs.promises, 'mkdir').mockResolvedValue();
    jest.spyOn(fs.promises, 'access').mockRejectedValue();
    jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

    await builder.build();
    expect(fs.promises.mkdir).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });

  test('should not overwrite existing controller files', async () => {
    jest.spyOn(fs.promises, 'mkdir').mockResolvedValue();
    jest.spyOn(fs.promises, 'access').mockResolvedValue();
    jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

    await builder.build();
    expect(fs.promises.writeFile).not.toHaveBeenCalled();
  });
});
