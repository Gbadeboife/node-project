const express = require('express');
const router = express.Router();
const ReportService = require('../services/ReportService');
const ResponseService = require('../services/ResponseService');
const ValidationService = require('../services/ValidationService');
const logger = require('../services/LoggerService');

// Validation rules
const monthYearRules = {
  month: 'required|integer|min:1|max:12',
  year: 'required|integer|min:2000|max:2100'
};

const dateRangeRules = {
  from_date: 'required|date',
  to_date: 'required|date'
};

const yearUserRules = {
  year: 'required|integer|min:2000|max:2100',
  user_id: 'required|integer|min:1'
};

/**
 * @swagger
 * /report/sale:
 *   get:
 *     summary: Get total sales for a specific month and year
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month number (1-12)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2000
 *           maximum: 2100
 *         description: Year
 *     responses:
 *       200:
 *         description: Total sales amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 */
// GET /api/v1/report/sale?month=1&year
router.get('/sale', 
  ValidationService.validateInput(monthYearRules, {}, 'query'),
  async (req, res) => {
    try {
      logger.info('Getting sales by month and year', { query: req.query });
      const { month, year } = req.query;

      // Check validation errors
      if (req.validationError) {
        return ResponseService.validationError(res, req.validationError);
      }

      const data = await ReportService.getSalesByMonthYear(month, year);
      return ResponseService.success(res, data);
    } catch (err) {
      logger.error('Error getting sales by month and year', err);
      return ResponseService.error(res, err);
    }
  }
);

/**
 * @swagger
 * /report/sale/range:
 *   get:
 *     summary: Get total sales between two dates
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 */
// GET /api/v1/report/sale/range?from_date=2022-01-01&to_date=2022-02-02
router.get('/sale/range',
  ValidationService.validateInput(dateRangeRules, {}, 'query'),
  async (req, res) => {
    try {
      logger.info('Getting sales by date range', { query: req.query });
      const { from_date, to_date } = req.query;

      // Check validation errors
      if (req.validationError) {
        return ResponseService.validationError(res, req.validationError);
      }

      const data = await ReportService.getSalesByDateRange(from_date, to_date);
      return ResponseService.success(res, data);
    } catch (err) {
      logger.error('Error getting sales by date range', err);
      return ResponseService.error(res, err);
    }
  }
);

// GET /api/v1/report/monthly?year=2022
router.get('/monthly',
  ValidationService.validateInput({ year: yearUserRules.year }, {}, 'query'),
  async (req, res) => {
    try {
      logger.info('Getting monthly sales', { query: req.query });
      const { year } = req.query;

      // Check validation errors
      if (req.validationError) {
        return ResponseService.validationError(res, req.validationError);
      }

      const data = await ReportService.getMonthlySalesByYear(year);
      return ResponseService.success(res, data);
    } catch (err) {
      logger.error('Error getting monthly sales', err);
      return ResponseService.error(res, err);
    }
  }
);

// GET /api/v1/report/user?year=2022&user_id=1
router.get('/user',
  ValidationService.validateInput(yearUserRules, {}, 'query'),
  async (req, res) => {
    try {
      logger.info('Getting user sales', { query: req.query });
      const { year, user_id } = req.query;

      // Check validation errors
      if (req.validationError) {
        return ResponseService.validationError(res, req.validationError);
      }

      const data = await ReportService.getUserSalesByYear(year, user_id);
      return ResponseService.success(res, data);
    } catch (err) {
      logger.error('Error getting user sales', err);
      return ResponseService.error(res, err);
    }
  }
);

// GET /api/v1/report/shipping_dock?year=2022&shipping_dock_id=1
router.get('/shipping_dock',
  ValidationService.validateInput({
    year: yearUserRules.year,
    shipping_dock_id: 'required|integer|min:1'
  }, {}, 'query'),
  async (req, res) => {
    try {
      logger.info('Getting shipping dock sales', { query: req.query });
      const { year, shipping_dock_id } = req.query;

      // Check validation errors
      if (req.validationError) {
        return ResponseService.validationError(res, req.validationError);
      }

      const data = await ReportService.getShippingDockSalesByYear(year, shipping_dock_id);
      return ResponseService.success(res, data);
    } catch (err) {
      logger.error('Error getting shipping dock sales', err);
      return ResponseService.error(res, err);
    }
  }
);

// GET /api/v1/report/user/count?year=2022&user_id=1
router.get('/user/count',
  ValidationService.validateInput(yearUserRules, {}, 'query'),
  async (req, res) => {
    try {
      logger.info('Getting user order count', { query: req.query });
      const { year, user_id } = req.query;

      // Check validation errors
      if (req.validationError) {
        return ResponseService.validationError(res, req.validationError);
      }

      const data = await ReportService.getUserOrderCountByYear(year, user_id);
      return ResponseService.success(res, data);
    } catch (err) {
      logger.error('Error getting user order count', err);
      return ResponseService.error(res, err);
    }
  }
);

module.exports = router; 