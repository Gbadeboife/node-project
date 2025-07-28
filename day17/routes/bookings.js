const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../models');
const { validateInput, handleValidationErrorForAPI } = require('../services/ValidationService');
const { errorHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Validation rules for booking
const bookingValidation = validateInput({
  fullName: 'required|string|minLength:2|maxLength:100',
  email: 'required|email',
  company: 'required|string',
  phone: 'required|string',
  scheduleId: 'required|integer'
}, {
  'fullName.required': 'Full name is required',
  'email.email': 'Please provide a valid email address',
  'company.required': 'Company name is required',
  'phone.required': 'Phone number is required',
  'scheduleId.required': 'Schedule ID is required'
});

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve a list of all bookings with their associated schedules
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const bookings = await db.Booking.findAll({
      include: [{
        model: db.Schedule,
        as: 'schedule'
      }]
    });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    errorHandler(error, req, res);
  }
});

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new booking for an available schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - fullName
 *               - email
 *               - company
 *               - phone
 *             properties:
 *               scheduleId:
 *                 type: integer
 *                 description: ID of the schedule to book
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Schedule not found or not available
 *       500:
 *         description: Server error
 */
router.post('/', bookingValidation, handleValidationErrorForAPI, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    // Request validation is handled by the ValidationService middleware

    const { scheduleId, fullName, email, company, phone, notes } = req.body;

    // Check if schedule exists and is available
    const schedule = await db.Schedule.findOne({
      where: {
        id: scheduleId,
        isAvailable: true
      },
      transaction
    });

    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Schedule not found or no longer available'
      });
    }

    // Create booking
    const booking = await db.Booking.create({
      scheduleId,
      fullName,
      email,
      company,
      phone,
      notes,
      status: 'pending'
    }, { transaction });

    // Update schedule availability
    await schedule.update({ isAvailable: false }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating booking:', error);
    errorHandler(error, req, res);
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await db.Booking.findByPk(req.params.id, {
      include: [{
        model: db.Schedule,
        as: 'schedule'
      }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Error fetching booking:', error);
    errorHandler(error, req, res);
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { status } = req.body;
    const booking = await db.Booking.findByPk(req.params.id, { transaction });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.update({ status }, { transaction });

    if (status === 'cancelled') {
      await db.Schedule.update(
        { isAvailable: true },
        { where: { id: booking.scheduleId }, transaction }
      );
    }

    await transaction.commit();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error updating booking status:', error);
    errorHandler(error, req, res);
  }
});

module.exports = router;
