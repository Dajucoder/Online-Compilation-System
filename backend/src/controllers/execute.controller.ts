import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { executeCodeQueue } from '../queues/execute.queue'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()

export class ExecuteController {
  async execute(req: AuthRequest, res: Response) {
    const { language, code, input } = req.body
    const userId = req.user!.id

    const submission = await prisma.submission.create({
      data: {
        userId,
        language,
        code,
        input: input || '',
        status: 'pending',
      },
    })

    // Add to queue
    const job = await executeCodeQueue.add({
      submissionId: submission.id,
      language,
      code,
      input: input || '',
    })

    logger.info(`Job ${job.id} added for submission ${submission.id}`)

    res.status(202).json({
      status: 'success',
      data: {
        submissionId: submission.id,
        jobId: job.id,
        message: 'Code execution queued',
      },
    })
  }

  async getResult(req: AuthRequest, res: Response): Promise<void> {
    const id = (req as any).params.id
    const userId = req.user?.id // Optional user ID

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Submission ID is required',
      })
      return
    }

    // If user is authenticated, only return their submissions
    // If not authenticated, still return the submission (UUID is secure enough)
    const submission = await prisma.submission.findFirst({
      where: userId ? { id, userId } : { id },
      include: { result: true },
    })

    if (!submission) {
      res.status(404).json({
        status: 'error',
        message: 'Submission not found',
      })
      return
    }

    res.json({
      status: 'success',
      data: { submission },
    })
  }
}
