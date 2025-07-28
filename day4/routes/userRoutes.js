const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const ValidationService = require('../services/ValidationService');

// GET all users
router.get('/', 
    UserController.getAll.bind(UserController)
);

// GET one user
router.get('/:id', 
    UserController.getOne.bind(UserController)
);

// CREATE user
router.post('/', 
    ValidationService.validateEmail(),
    ValidationService.validate,
    UserController.create.bind(UserController)
);

// UPDATE user
router.put('/:id',
    ValidationService.validateEmail(),
    ValidationService.validate,
    UserController.update.bind(UserController)
);

// DELETE user
router.delete('/:id',
    UserController.delete.bind(UserController)
);

module.exports = router;
