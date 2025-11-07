import rateLimit from 'express-rate-limit'
import { config } from '../config'

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000, // Convert minutes to milliseconds
  max: config.rateLimitMax,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
