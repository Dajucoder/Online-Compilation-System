import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

export class SubmissionController {
  async getSubmissions(req: AuthRequest, res: Response) {
    const userId = req.user!.id
    const query = req.query || {}
    const page = parseInt((query.page as string) || '1')
    const limit = parseInt((query.limit as string) || '20')
    const skip = (page - 1) * limit

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { result: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.submission.count({ where: { userId } }),
    ])

    res.json({
      status: 'success',
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  }

  async getSubmission(req: AuthRequest, res: Response) {
    const id = (req.params as any).id
    const userId = req.user!.id

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID is required',
      })
    }

    const submission = await prisma.submission.findFirst({
      where: { id, userId },
      include: { result: true },
    })

    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found',
      })
    }

    return res.json({
      status: 'success',
      data: { submission },
    })
  }

  async deleteSubmission(req: AuthRequest, res: Response) {
    const id = (req.params as any).id
    const userId = req.user!.id

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID is required',
      })
    }

    const submission = await prisma.submission.findFirst({
      where: { id, userId },
    })

    if (!submission) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found',
      })
    }

    await prisma.submission.delete({
      where: { id },
    })

    return res.json({
      status: 'success',
      message: 'Submission deleted successfully',
    })
  }
}
