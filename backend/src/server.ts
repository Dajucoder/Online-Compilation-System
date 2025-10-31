import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import 'express-async-errors'
import { config } from './config'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import authRoutes from './routes/auth.routes'
import executeRoutes from './routes/execute.routes'
import submissionRoutes from './routes/submission.routes'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiter)

// Routes
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/execute', executeRoutes)
app.use('/api/submissions', submissionRoutes)

// Error handler
app.use(errorHandler)

// Start server
const PORT = config.port
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  logger.info(`Environment: ${config.nodeEnv}`)
})

export default app
