import Joi from 'joi'

export const executeSchema = Joi.object({
  language: Joi.string()
    .valid('python', 'java', 'cpp', 'c', 'javascript', 'go')
    .required(),
  code: Joi.string().max(100000).required(),
  input: Joi.string().max(10000).optional().allow(''),
})
