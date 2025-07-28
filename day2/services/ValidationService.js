const { Validator, addCustomMessages } = require('node-input-validator');

// {fieldName:message} eg:{email:"Invalid Email", password:"Password too short"}
const formatValidationError = (error) => {
  const formatted = Object.entries(error)
    .map(([key, value]) => ({
      field: key,
      message: value.message,
    }))
    .reduce((accumulator, currentValue) => {
      if (!accumulator[currentValue]) {
        accumulator[currentValue.field] = currentValue.message;
      }
      return accumulator;
    }, {});
  return formatted;
};

module.exports = {
  /**
   * Input Validator middleware for controller
   * @param {object} validationObject object defining fields and validation types
   * @param {object} _extendMessages object defining message to throw on validation error
   * @param {string} source 'body' or 'query' - where to look for parameters
   */
  validateInput: (validationObject = {}, _extendMessages = {}, source = 'body') => async (
    req,
    res,
    next,
  ) => {
    const dataToValidate = source === 'query' ? req.query : req.body;
    const validation = new Validator(dataToValidate, validationObject);
    addCustomMessages(_extendMessages);

    try {
      const isValid = await validation.check();
      if (!isValid) {
        req.validationError = formatValidationError(validation.errors);
      }
      return next();
    } catch (error) {
      req.validationError = error.message;
      return next();
    }
  },

  handleValidationErrorForViews: (
    req,
    res,
    viewModel,
    viewPath = '/',
    fieldsStoreKey,
    defaultValue = {},
  ) => {
    const validationError = req.validationError;

    if (validationError) {
      // Remembers fields if validation error occurs
      Object.entries(defaultValue).forEach(([key, value]) => {
        viewModel[fieldsStoreKey][key] = value;
      });

      if (typeof validationError === 'string') {
        viewModel.error = validationError;
      } else {
        viewModel.validationError = req.validationError;
      }
      return res.render(viewPath, viewModel);
    }
  },

  handleValidationErrorForAPI: (req, res, next) => {
    const validationError = req.validationError;

    if (validationError) {
      let error;
      if (typeof validationError === 'string') {
        error = validationError;
      } else {
        error = req.validationError;
      }
      return res.status(400).json({ success: false, error });
    }
    next();
  },
};
