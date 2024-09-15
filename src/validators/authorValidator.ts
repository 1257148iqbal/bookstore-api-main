import Joi from 'joi';

// Define a common validation schema
export const authorValidationSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Name cannot be empty.',
    'any.required': 'Name is required.'
  }),
  bio: Joi.string().allow('').optional(),
  birthdate: Joi.date().required().messages({
    'date.base': 'Invalid birthdate format.',
    'any.required': 'Birthdate is required.'
  }),
});

export const validateAuthor = (data: any) => {
    const { error } = authorValidationSchema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return errors;
    }
    return null;
  };