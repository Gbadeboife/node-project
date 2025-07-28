const { Parser } = require('expr-eval');

/**
 * Safely evaluates a condition string with given variables
 * Uses expr-eval instead of eval() for security
 */
const evaluateCondition = (condition, variables) => {
  const parser = new Parser();
  
  // Replace variable names in condition with their values
  let parsedCondition = condition;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    parsedCondition = parsedCondition.replace(regex, JSON.stringify(value));
  }

  try {
    return parser.evaluate(parsedCondition);
  } catch (error) {
    throw new Error(`Invalid condition: ${error.message}`);
  }
};

module.exports = {
  evaluateCondition
};
