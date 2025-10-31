import dotenv from 'dotenv'

dotenv.config()

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Docker
  dockerHost: process.env.DOCKER_HOST,
  
  // Execution limits
  maxExecutionTime: parseInt(process.env.MAX_EXECUTION_TIME || '10', 10),
  maxMemory: parseInt(process.env.MAX_MEMORY || '256', 10),
  maxCpuCores: parseFloat(process.env.MAX_CPU_CORES || '0.5'),
  maxDiskSpace: parseInt(process.env.MAX_DISK_SPACE || '100', 10),
  maxOutputSize: parseInt(process.env.MAX_OUTPUT_SIZE || '1024', 10),
  
  // Rate limiting
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '1', 10),
  
  // Worker
  workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
  taskTimeout: parseInt(process.env.TASK_TIMEOUT || '30000', 10),
}
