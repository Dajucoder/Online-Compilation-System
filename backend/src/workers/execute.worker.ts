import { Job } from 'bull'
import { PrismaClient } from '@prisma/client'
import { DockerExecutor } from '../services/docker.service'
import { logger } from '../utils/logger'

const prisma = new PrismaClient()
const dockerExecutor = new DockerExecutor()

interface ExecuteJob {
  submissionId: string
  language: string
  code: string
  input: string
}

export const executeCodeWorker = async (job: Job<ExecuteJob>) => {
  const { submissionId, language, code, input } = job.data

  logger.info(`Processing job ${job.id} for submission ${submissionId}`)

  try {
    // Update status to running
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'running' },
    })

    // Execute code in Docker container
    const result = await dockerExecutor.execute({
      language,
      code,
      input,
    })

    // Clean output by removing null bytes and other invalid characters
    const cleanString = (str: string): string => {
      return str
        .replace(/\0/g, '') // Remove null bytes
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove other control characters except newline, carriage return, and tab
    }

    // Save result
    await prisma.executionResult.create({
      data: {
        submission: {
          connect: { id: submissionId }
        },
        stdout: cleanString(result.stdout),
        stderr: cleanString(result.stderr),
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed || 0,
        exitCode: result.exitCode,
      },
    })

    // Update submission status
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'completed' },
    })

    logger.info(`Job ${job.id} completed successfully`)
    return result
  } catch (error) {
    logger.error(`Job ${job.id} failed:`, error)

    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'failed' },
    })

    throw error
  }
}
