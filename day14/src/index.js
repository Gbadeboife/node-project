const fs = require('fs').promises;
const path = require('path');
const ModelBuilder = require('./builders/ModelBuilder');
const ControllerBuilder = require('./builders/ControllerBuilder');
const logger = require('./utils/logger');

async function main() {
  try {
    // Read configuration file
    const configPath = path.join(__dirname, '../configuration.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // Initialize builders
    const modelBuilder = new ModelBuilder(config);
    const controllerBuilder = new ControllerBuilder(config);

    // Build models and controllers
    await modelBuilder.build();
    await controllerBuilder.build();

    logger.info('Successfully generated all files');
  } catch (error) {
    logger.error('Error in main execution:', error);
    process.exit(1);
  }
}

main(); 