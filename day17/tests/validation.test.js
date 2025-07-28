const { validateInput } = require('../services/ValidationService');

// Test suite for ValidationService
describe('ValidationService', () => {
  // Setup test environment
  let mockReq;
  let mockRes;
  let mockNext;

  // Reset mocks before each test
  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  // Test validation of booking form data
  it('should validate booking form fields', async () => {
    mockReq.body = {
      email: 'invalid-email',
      fullName: '', // empty name
      phone: '123', // too short
      company: undefined // missing
    };

    const validationRules = {
      email: 'required|email',
      fullName: 'required|string|minLength:2',
      phone: 'required|string|minLength:10',
      company: 'required|string'
    };

    await validateInput(validationRules)(mockReq, mockRes, mockNext);

    expect(mockReq.validationError).toBeDefined();
    expect(mockReq.validationError.email).toBeDefined();
    expect(mockReq.validationError.name).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    mockReq.body = {
      email: 'test@example.com',
      name: 'John Doe'
    };

    const validationRules = {
      email: 'required|email',
      name: 'required'
    };

    await validateInput(validationRules)(mockReq, mockRes, mockNext);

    expect(mockReq.validationError).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle custom validation messages', async () => {
    mockReq.body = {
      email: 'invalid-email'
    };

    const validationRules = {
      email: 'required|email'
    };

    const customMessages = {
      'email.email': 'Custom email error message'
    };

    await validateInput(validationRules, customMessages)(mockReq, mockRes, mockNext);

    expect(mockReq.validationError).toBeDefined();
    expect(mockReq.validationError.email).toBe('Custom email error message');
  });
});
