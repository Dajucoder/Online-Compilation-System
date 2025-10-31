import { Router } from 'express'
import { SubmissionController } from '../controllers/submission.controller'
import { authenticate } from '../middleware/auth'

const router = Router()
const submissionController = new SubmissionController()

router.get('/', authenticate, submissionController.getHistory)
router.get('/:id', authenticate, submissionController.getOne)
router.delete('/:id', authenticate, submissionController.delete)

export default router
