import { Router } from 'express'
import { SubmissionController } from '../controllers/submission.controller'
import { authenticate } from '../middleware/auth'

const router = Router()
const submissionController = new SubmissionController()

router.get('/', authenticate, submissionController.getSubmissions)
router.get('/:id', authenticate, submissionController.getSubmission)
router.delete('/:id', authenticate, submissionController.deleteSubmission)

export default router
