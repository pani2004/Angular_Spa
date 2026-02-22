import Joi from 'joi';

/**
 * User registration validation schema
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'any.required': 'Last name is required'
  }),
  role: Joi.string().valid('ADMIN', 'USER').default('USER')
});

/**
 * User login validation schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('ADMIN', 'USER').required().messages({
    'any.required': 'Role is required'
  })
});

/**
 * User update validation schema
 */
const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  role: Joi.string().valid('ADMIN', 'USER'),
  isActive: Joi.boolean()
}).min(1); 

/**
 * Delay parameter validation schema
 */
const delaySchema = Joi.object({
  delay: Joi.number().integer().min(0).max(5000).default(0)
});

export {
  registerSchema,
  loginSchema,
  updateUserSchema,
  delaySchema
};
