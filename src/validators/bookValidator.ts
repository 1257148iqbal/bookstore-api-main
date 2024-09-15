import Joi from 'joi';

// Define a common validation schema
export const bookValidationSchema = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Title cannot be empty.',
    'any.required': 'Title is required.'
  }),
  description: Joi.string().allow('').optional(),
  published_date: Joi.date().required().messages({
    'date.base': 'Invalid published date format.',
    'any.required': 'Published date is required.'
  }),
  author_id: Joi.number().integer().required().messages({
    'number.base': 'Author ID must be a number.',
    'any.required': 'Author ID is required.'
  }),
});

export const validateBook = (data: any) => {
  const { error } = bookValidationSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return errors;
  }
  return null;
};
