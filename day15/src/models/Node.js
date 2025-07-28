const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Node Model - Represents a node in the tree structure
 * This model implements the TreeQL specification for hierarchical data
 * Each node can have one parent and multiple children
 */
const Node = sequelize.define('Node', {
  // Primary key for the node
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Name of the node (required)
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  // Reference to parent node (optional for root nodes)
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Nodes',
      key: 'id'
    }
  },
  // Additional data stored as JSON (optional)
  data: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'nodes'
});

// Define self-referential relationships for tree structure
// Each node can have one parent
Node.belongsTo(Node, { as: 'parent', foreignKey: 'parentId' });
// Each node can have multiple children
Node.hasMany(Node, { as: 'children', foreignKey: 'parentId' });

module.exports = Node; 