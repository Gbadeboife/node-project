# TreeQL API

A RESTful API implementation of [TreeQL](https://www.treeql.org/) for managing hierarchical data structures.

## Features

- CRUD operations for tree nodes
- Move nodes within the tree
- Prevent circular references




- `POST /api/v1/nodes` - Create a new node
- `GET /api/v1/nodes/:id` - Get a node and its children
- `PUT /api/v1/nodes/:id` - Update a node
- `DELETE /api/v1/nodes/:id` - Delete a node
- `POST /api/v1/nodes/:id/move` - Move a node to a new parent
