/**
 * Utility for creating standardized API responses
 */
class ApiResponse {
  /**
   * Create a success response
   * @param {*} data - The data to send
   * @param {string} message - Optional success message
   * @returns {Object} Standardized success response
   */
  static success(data, message = 'Operation successful') {
    return {
      status: 'success',
      message,
      data
    };
  }

  /**
   * Create an error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} errors - Optional error details
   * @returns {Object} Standardized error response
   */
  static error(message, statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      message,
      statusCode
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return response;
  }
}

module.exports = ApiResponse;
