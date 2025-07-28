const BaseController = require('./base.controller');
const { User } = require('../models');
const ValidationService = require('../services/ValidationService');
const logger = require('../utils/logger');

class UserController extends BaseController {
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            return this.sendSuccess(res, users);
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    static async getOne(req, res) {
        try {
            const { id } = req.params;
            if (!ValidationService.isValidId(id)) {
                return this.sendError(res, { status: 400, message: 'Invalid ID format' });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return this.sendError(res, { status: 404, message: 'User not found' });
            }

            return this.sendSuccess(res, user);
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    static async create(req, res) {
        try {
            const { email, name, status } = req.body;

            // Validate input
            const validationErrors = [];
            if (!ValidationService.isValidEmail(email)) {
                validationErrors.push('Invalid email format');
            }
            if (!ValidationService.isValidName(name)) {
                validationErrors.push('Invalid name format');
            }
            if (!ValidationService.isValidStatus(status)) {
                validationErrors.push('Invalid status value');
            }

            if (validationErrors.length > 0) {
                return this.sendError(res, {
                    status: 400,
                    message: 'Validation failed',
                    errors: validationErrors
                });
            }

            const user = await User.create({ email, name, status });
            logger.info(`New user created with ID: ${user.id}`);
            
            return this.sendSuccess(res, user, 'User created successfully', 201);
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    static async update(req, res) {
        const transaction = await User.sequelize.transaction();
        try {
            const { id } = req.params;
            const { email, name, status } = req.body;

            if (!ValidationService.isValidId(id)) {
                return this.sendError(res, { status: 400, message: 'Invalid ID format' });
            }

            const user = await User.findByPk(id, { transaction });
            if (!user) {
                await transaction.rollback();
                return this.sendError(res, { status: 404, message: 'User not found' });
            }

            // Validate input
            const validationErrors = [];
            if (email && !ValidationService.isValidEmail(email)) {
                validationErrors.push('Invalid email format');
            }
            if (name && !ValidationService.isValidName(name)) {
                validationErrors.push('Invalid name format');
            }
            if (status && !ValidationService.isValidStatus(status)) {
                validationErrors.push('Invalid status value');
            }

            if (validationErrors.length > 0) {
                await transaction.rollback();
                return this.sendError(res, {
                    status: 400,
                    message: 'Validation failed',
                    errors: validationErrors
                });
            }

            await user.update({ email, name, status }, { transaction });
            await transaction.commit();
            
            logger.info(`User updated with ID: ${user.id}`);
            return this.sendSuccess(res, user, 'User updated successfully');
        } catch (error) {
            await transaction.rollback();
            return this.sendError(res, error);
        }
    }

    static async delete(req, res) {
        const transaction = await User.sequelize.transaction();
        try {
            const { id } = req.params;
            
            if (!ValidationService.isValidId(id)) {
                return this.sendError(res, { status: 400, message: 'Invalid ID format' });
            }

            const user = await User.findByPk(id, { transaction });
            if (!user) {
                await transaction.rollback();
                return this.sendError(res, { status: 404, message: 'User not found' });
            }

            await user.destroy({ transaction });
            await transaction.commit();

            logger.info(`User deleted with ID: ${id}`);
            return this.sendSuccess(res, null, 'User deleted successfully');
        } catch (error) {
            await transaction.rollback();
            return this.sendError(res, error);
        }
    }
}

module.exports = UserController;
