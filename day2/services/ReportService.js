const { fn, col, literal, Op } = require('sequelize');
const db = require('../models');
const Transaction = db.Transaction;
const Order = db.Order;

class ReportService {
  async getSalesByMonthYear(month, year) {
    if (!month || !year) throw new Error('Month and year are required');
    const where = literal(`MONTH(created_at) = ${parseInt(month)} AND YEAR(created_at) = ${parseInt(year)}`);
    const total = await Transaction.sum('amount', { where });
    return { total: total || 0 };
  }

  async getSalesByDateRange(fromDate, toDate) {
    if (!fromDate || !toDate) throw new Error('From date and to date are required');
    let from = new Date(fromDate);
    let to = new Date(toDate);
    if (from > to) [from, to] = [to, from];
    const total = await Transaction.sum('amount', { 
      where: { created_at: { [Op.between]: [from, to] } }
    });
    return { total: total || 0 };
  }

  async getMonthlySalesByYear(year) {
    if (!year) throw new Error('Year is required');
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    return results.filter(r => parseFloat(r.total) > 0);
  }

  async getUserSalesByYear(year, userId) {
    if (!year || !userId) throw new Error('Year and user ID are required');
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)} AND user_id = ${parseInt(userId)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    return results.filter(r => parseFloat(r.total) > 0);
  }

  async getShippingDockSalesByYear(year, shippingDockId) {
    if (!year || !shippingDockId) throw new Error('Year and shipping dock ID are required');
    const results = await Transaction.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)} AND shipping_dock_id = ${parseInt(shippingDockId)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    return results.filter(r => parseFloat(r.total) > 0);
  }

  async getUserOrderCountByYear(year, userId) {
    if (!year || !userId) throw new Error('Year and user ID are required');
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const results = await Order.findAll({
      attributes: [
        [fn('MONTH', col('created_at')), 'month'],
        [fn('COUNT', col('id')), 'order_count']
      ],
      where: literal(`YEAR(created_at) = ${parseInt(year)} AND user_id = ${parseInt(userId)}`),
      group: [fn('MONTH', col('created_at'))],
      raw: true
    });
    const countMap = results.reduce((acc, r) => {
      acc[r.month] = parseInt(r.order_count);
      return acc;
    }, {});
    return months.map(m => ({ month: m, order_count: countMap[m] || 0 }));
  }
}

module.exports = new ReportService(); 