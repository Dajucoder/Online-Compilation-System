import Queue from 'bull'
import { config } from '../config'
import { executeCodeWorker } from '../workers/execute.worker'

export const executeCodeQueue = new Queue('code-execution', config.redisUrl, {
  defaultJobOptions: {
    attempts: 3,
    timeout: config.taskTimeout,
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

executeCodeQueue.process(config.workerConcurrency, executeCodeWorker)

executeCodeQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

executeCodeQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message)
})
