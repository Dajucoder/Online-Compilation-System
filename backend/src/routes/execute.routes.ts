import { Router } from 'express'
import { ExecuteController } from '../controllers/execute.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validator'
import { executeSchema } from '../schemas/execute.schema'
import { strictRateLimiter } from '../middleware/rateLimiter'

const router = Router()
const executeController = new ExecuteController()

router.post(
  '/',
  authenticate,
  strictRateLimiter,
  validate(executeSchema),
  executeController.execute
)

// Get result endpoint - authentication optional for polling
router.get('/:id', executeController.getResult)

export default router
