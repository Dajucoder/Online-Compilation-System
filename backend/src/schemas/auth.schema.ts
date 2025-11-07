import Joi from 'joi'

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const executeSchema = Joi.object({
  language: Joi.string().valid('python', 'javascript', 'java', 'cpp', 'c', 'go').required(),
  code: Joi.string().required(),
  input: Joi.string().allow('').optional(),
})
