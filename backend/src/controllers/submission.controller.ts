import { Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

export class SubmissionController {
  async getHistory(req: AuthRequest, res: Response) {
    const userId = req.user!.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where: { userId },
        include: { result: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
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
          pages: Math.ceil(total / limit),
        },
      },
    })
  }

  async getOne(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user!.id

    const submission = await prisma.submission.findFirst({
      where: { id, userId },
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

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params
    const userId = req.user!.id

    const submission = await prisma.submission.findFirst({
      where: { id, userId },
    })

    if (!submission) {
      res.status(404).json({
        status: 'error',
        message: 'Submission not found',
      })
      return
    }

    await prisma.submission.delete({ where: { id } })

    res.json({
      status: 'success',
      message: 'Submission deleted',
    })
  }
}
