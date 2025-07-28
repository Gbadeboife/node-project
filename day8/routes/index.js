const express = require('express');
const router = express.Router();
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');
const db = require("../models");
const path = require('path');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get quiz HTML page
 *     responses:
 *       200:
 *         description: Returns the quiz HTML page
 */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../quiz.html'));
});

/**
 * @swagger
 * /api/quiz:
 *   get:
 *     summary: Get all quizzes with their questions and options
 *     responses:
 *       200:
 *         description: Returns array of quizzes
 *       500:
 *         description: Server error
 */
router.get('/api/quiz', async function(req, res, next) {
  try {
    const quizzes = await db.sequelize.transaction(async (t) => {
      return await db.quiz.findAll({
        include: [
          {
            model: db.question,
            as: 'questions',
            include: [
              {
                model: db.option,
                as: 'options',
              }
            ]
          }
        ],
        transaction: t
      });
    });
    
    res.json({
      success: true,
      data: quizzes
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
