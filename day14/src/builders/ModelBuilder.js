const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

/**
 * ModelBuilder class responsible for generating Sequelize model files
 * from configuration specifications.
 * 
 * @class ModelBuilder
 */
class ModelBuilder {
  /**
   * Creates an instance of ModelBuilder.
   * @param {Object} config - Configuration object containing model definitions
   */
  constructor(config) {
    this.config = config;
    this.outputDir = path.join(__dirname, '../../release/models');
  }

  /**
   * Generates the content for a Sequelize model file.
   * 
   * @param {Object} modelConfig - Configuration for a specific model
   * @returns {string} Generated model file content
   */
  generateModelContent(modelConfig) {
    // Map field definitions to Sequelize model attributes
    const fields = modelConfig.field.map(([name, type, label, ...rules]) => {
      return `      ${name}: {
        type: DataTypes.${type.toUpperCase()},
        allowNull: ${!rules.includes('required')},
        validate: {
          notNull: ${rules.includes('required')},
          ${type === 'string' ? `len: [0, 255],` : ''}
        }
      }`;
    }).join(',\n');

    // Generate the complete model file content
    return `const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * ${modelConfig.name} model class
 * @class ${modelConfig.name.charAt(0).toUpperCase() + modelConfig.name.slice(1)}
 * @extends Model
 */
class ${modelConfig.name.charAt(0).toUpperCase() + modelConfig.name.slice(1)} extends Model {}

${modelConfig.name.charAt(0).toUpperCase() + modelConfig.name.slice(1)}.init({
${fields}
}, {
  sequelize,
  modelName: '${modelConfig.name}',
  timestamps: true,
  paranoid: true // Enables soft deletes
});

module.exports = ${modelConfig.name.charAt(0).toUpperCase() + modelConfig.name.slice(1)};`;
  }

  /**
   * Builds all model files based on the configuration.
   * Creates the output directory if it doesn't exist.
   * 
   * @returns {Promise<void>}
   * @throws {Error} If file generation fails
   */
  async build() {
    try {
      // Create output directory if it doesn't exist
      await fs.mkdir(this.outputDir, { recursive: true });

      // Generate a model file for each configuration
      for (const modelConfig of this.config.model) {
        const modelContent = this.generateModelContent(modelConfig);
        const filePath = path.join(this.outputDir, `${modelConfig.name}.js`);
        
        // Check if file already exists to avoid overwriting
        try {
          await fs.access(filePath);
          logger.info(`Model file already exists: ${filePath}`);
          continue;
        } catch {
          // File doesn't exist, proceed with creation
          await fs.writeFile(filePath, modelContent);
          logger.info(`Generated model file: ${filePath}`);
        }
      }

      logger.info('Model generation completed successfully');
    } catch (error) {
      logger.error('Error generating models:', error);
      throw error;
    }
  }
}

module.exports = ModelBuilder; 