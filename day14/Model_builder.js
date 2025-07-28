const fs = require('fs');
const path = require('path');
const logger = require('./src/utils/logger');

/**
 * Model_builder class responsible for generating model files from configuration
 * @class Model_builder
 */
class Model_builder {
  constructor() {
    try {
      // Read and parse configuration file
      const configPath = path.resolve('configuration.json');
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // Validate configuration structure
      this.validateConfig(this.config);
    } catch (error) {
      logger.error(`Failed to initialize Model_builder: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validates the configuration object structure
   * @param {Object} config - The configuration object to validate
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    if (!config.model || !Array.isArray(config.model)) {
      throw new Error('Configuration must contain a "model" array');
    }

    config.model.forEach((model, index) => {
      if (!model.name) {
        throw new Error(`Model at index ${index} must have a name`);
      }
      if (!Array.isArray(model.field)) {
        throw new Error(`Model "${model.name}" must have a field array`);
      }
      model.field.forEach((field, fieldIndex) => {
        if (!Array.isArray(field) || field.length !== 4) {
          throw new Error(`Field at index ${fieldIndex} in model "${model.name}" must be an array with 4 elements`);
        }
      });
    });
  }

  /**
   * Builds model files based on configuration
   * @returns {void}
   */
  build() {
    try {
      // Create release directory if it doesn't exist
      const releaseDir = path.resolve('release');
      if (!fs.existsSync(releaseDir)) {
        fs.mkdirSync(releaseDir);
      }

      // Process each model in the configuration
      this.config.model.forEach(model => {
        this.generateModelFile(model);
      });

      // Copy initialize files
      this.copyInitializeFiles();

      logger.info('Model generation completed successfully');
    } catch (error) {
      logger.error(`Build failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates a model file for the given model configuration
   * @param {Object} model - The model configuration object
   * @private
   */
  generateModelFile(model) {
    const modelContent = this.generateModelContent(model);
    const filePath = path.join('release', 'models', `${model.name}.js`);
    
    // Create models directory if it doesn't exist
    const modelsDir = path.join('release', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, modelContent);
    logger.info(`Generated model file: ${filePath}`);
  }

  /**
   * Generates the content for a model file
   * @param {Object} model - The model configuration object
   * @returns {string} The generated model content
   * @private
   */
  generateModelContent(model) {
    const fieldDefinitions = model.field.map(([name, type, label, validation]) => {
      return `
    ${name}: {
      type: DataTypes.${type.toUpperCase()},
      allowNull: ${validation !== 'required'},
      field: '${name}',
      comment: '${label}'
    }`;
    }).join(',');

    return `const { Model, DataTypes } = require('sequelize');

/**
 * ${model.name} model
 * @class ${model.name}
 * @extends Model
 */
module.exports = (sequelize) => {
  class ${model.name} extends Model {}

  ${model.name}.init({${fieldDefinitions}
  }, {
    sequelize,
    modelName: '${model.name}',
    timestamps: true
  });

  return ${model.name};
};`;
  }

  /**
   * Copies initialize files to the release directory
   * @private
   */
  copyInitializeFiles() {
    const initializeDir = path.resolve('initialize');
    const releaseDir = path.resolve('release');

    if (fs.existsSync(initializeDir)) {
      fs.readdirSync(initializeDir).forEach(file => {
        const srcPath = path.join(initializeDir, file);
        const destPath = path.join(releaseDir, file);
        fs.copyFileSync(srcPath, destPath);
      });
      logger.info('Copied initialize files to release directory');
    }
  }
}

module.exports = Model_builder;