import { Router } from 'express'
import { ExecuteController } from '../controllers/execute.controller'
import { authenticate } from '../middleware/auth'

const router = Router()
const executeController = new ExecuteController()

router.post('/', authenticate, executeController.execute.bind(executeController))
router.get('/:id', authenticate, executeController.getResult.bind(executeController))

export default router
