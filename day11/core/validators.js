const { ValidationError } = require('./errors');

const validateMovieInput = (input) => {
  const errors = [];
  
  if (!input.title) {
    errors.push('Title is required');
  }
  
  if (!input.director_id) {
    errors.push('Director ID is required');
  }
  
  if (!input.main_genre) {
    errors.push('Main genre is required');
  }
  
  if (!input.status) {
    errors.push('Status is required');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
};

const validateReviewInput = (input) => {
  const errors = [];
  
  if (!input.notes) {
    errors.push('Notes are required');
  }
  
  if (!input.movie_id) {
    errors.push('Movie ID is required');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
};

const validateActorInput = (input) => {
  const errors = [];
  
  if (!input.name) {
    errors.push('Name is required');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
};

module.exports = {
  validateMovieInput,
  validateReviewInput,
  validateActorInput
}; 