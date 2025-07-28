var express = require('express');
var router = express.Router();
const ValidationService = require('../services/ValidationService');

// Home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Example protected API route under /api/v1/portal/something
// This route demonstrates authentication, role checking, user_id passing, and input validation
router.post('/api/v1/portal/something',
  // Validate that 'data' field is present in the request body
  ValidationService.validateInput({ data: 'required|string' }, { 'data.required': 'Data is required.' }),
  ValidationService.handleValidationErrorForAPI,
  function(req, res) {
    res.json({
      success: true,
      message: 'Access granted',
      user_id: req.user_id,
      tokenPayload: req.tokenPayload,
      data: req.body.data
    });
  }
);

module.exports = router;
