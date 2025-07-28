const ReportService = require('../../services/ReportService');
const db = require('../../models');
const { Transaction, Order } = db;

// Mock the database models
jest.mock('../../models', () => ({
  Transaction: {
    sum: jest.fn(),
    findAll: jest.fn()
  },
  Order: {
    findAll: jest.fn()
  }
}));

describe('ReportService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getSalesByMonthYear', () => {
    it('should return total sales for given month and year', async () => {
      // Arrange
      const month = 1;
      const year = 2022;
      Transaction.sum.mockResolvedValue(1000);

      // Act
      const result = await ReportService.getSalesByMonthYear(month, year);

      // Assert
      expect(result).toEqual({ total: 1000 });
      expect(Transaction.sum).toHaveBeenCalled();
    });

    it('should throw error if month or year is missing', async () => {
      // Act & Assert
      await expect(ReportService.getSalesByMonthYear(null, 2022))
        .rejects
        .toThrow('Month and year are required');
    });
  });

  describe('getMonthlySalesByYear', () => {
    it('should return monthly sales for given year', async () => {
      // Arrange
      const year = 2022;
      const mockResults = [
        { month: 1, total: '1000' },
        { month: 2, total: '2000' }
      ];
      Transaction.findAll.mockResolvedValue(mockResults);

      // Act
      const result = await ReportService.getMonthlySalesByYear(year);

      // Assert
      expect(result).toEqual(mockResults);
      expect(Transaction.findAll).toHaveBeenCalled();
    });
  });

  describe('getUserOrderCountByYear', () => {
    it('should return order count per month for given user and year', async () => {
      // Arrange
      const year = 2022;
      const userId = 1;
      const mockResults = [
        { month: 1, order_count: '5' },
        { month: 3, order_count: '3' }
      ];
      Order.findAll.mockResolvedValue(mockResults);

      // Act
      const result = await ReportService.getUserOrderCountByYear(year, userId);

      // Assert
      expect(result).toHaveLength(12); // Should return all months
      expect(result).toContainEqual({ month: 1, order_count: 5 });
      expect(result).toContainEqual({ month: 2, order_count: 0 }); // Missing month should have 0
      expect(Order.findAll).toHaveBeenCalled();
    });
  });
}); 