const BaseController = require('./BaseController');
const User = require('../models/user');
const logger = require('../utils/logger');
const { Sequelize } = require('sequelize');

class UserController extends BaseController {
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            return this.sendSuccess(res, users);
        } catch (error) {
            logger.error({
                message: 'Failed to fetch users',
                error: error.message
            });
            return this.sendError(res, 'Failed to fetch users', 500);
        }
    }

    static async getOne(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }
            return this.sendSuccess(res, user);
        } catch (error) {
            logger.error({
                message: 'Failed to fetch user',
                error: error.message,
                userId: req.params.id
            });
            return this.sendError(res, 'Failed to fetch user', 500);
        }
    }

    static async create(req, res) {
        const transaction = await Sequelize.transaction();
        try {
            const user = await User.create(req.body, { transaction });
            await transaction.commit();
            
            logger.info({
                message: 'User created successfully',
                userId: user.id
            });
            
            return this.sendSuccess(res, user, 'User created successfully', 201);
        } catch (error) {
            await transaction.rollback();
            logger.error({
                message: 'Failed to create user',
                error: error.message,
                payload: req.body
            });
            return this.sendError(res, 'Failed to create user', 500);
        }
    }

    static async update(req, res) {
        const transaction = await Sequelize.transaction();
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }

            await user.update(req.body, { transaction });
            await transaction.commit();

            logger.info({
                message: 'User updated successfully',
                userId: user.id
            });

            return this.sendSuccess(res, user, 'User updated successfully');
        } catch (error) {
            await transaction.rollback();
            logger.error({
                message: 'Failed to update user',
                error: error.message,
                userId: req.params.id,
                payload: req.body
            });
            return this.sendError(res, 'Failed to update user', 500);
        }
    }

    static async delete(req, res) {
        const transaction = await Sequelize.transaction();
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return this.sendError(res, 'User not found', 404);
            }

            await user.destroy({ transaction });
            await transaction.commit();

            logger.info({
                message: 'User deleted successfully',
                userId: req.params.id
            });

            return this.sendSuccess(res, null, 'User deleted successfully');
        } catch (error) {
            await transaction.rollback();
            logger.error({
                message: 'Failed to delete user',
                error: error.message,
                userId: req.params.id
            });
            return this.sendError(res, 'Failed to delete user', 500);
        }
    }
}

module.exports = UserController;
