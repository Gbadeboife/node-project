/**
 * Utility class for standardizing API responses
 */
class ApiResponse {
  /**
   * Creates a success response object
   * @param {any} data - The data to send in the response
   * @param {string} message - Optional success message
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Standardized success response
   */
  static success(data, message = 'Operation successful', statusCode = 200) {
    return {
      status: 'success',
      statusCode,
      message,
      data
    };
  }

  /**
   * Creates an error response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {any} errors - Optional additional error details
   * @returns {Object} Standardized error response
   */
  static error(message, statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      statusCode,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return response;
  }
}

module.exports = ApiResponse;
