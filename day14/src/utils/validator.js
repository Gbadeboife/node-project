const Joi = require('joi');

class Validator {
  static validateField(value, type, rules) {
    let schema;
    
    switch (type.toLowerCase()) {
      case 'integer':
        schema = Joi.number().integer();
        break;
      case 'string':
        schema = Joi.string();
        break;
      case 'boolean':
        schema = Joi.boolean();
        break;
      case 'date':
        schema = Joi.date();
        break;
      default:
        schema = Joi.any();
    }

    if (rules.includes('required')) {
      schema = schema.required();
    }

    const { error } = schema.validate(value);
    return !error;
  }

  static validateModel(data, modelConfig) {
    const errors = [];
    
    modelConfig.field.forEach(([fieldName, fieldType, fieldLabel, ...rules]) => {
      if (!this.validateField(data[fieldName], fieldType, rules)) {
        errors.push(`Invalid ${fieldLabel}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Validator; 