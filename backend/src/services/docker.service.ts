import Docker from 'dockerode'
import { config } from '../config'
import { logger } from '../utils/logger'
import * as fs from 'fs/promises'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

const docker = new Docker(config.dockerHost ? { host: config.dockerHost } : {})

export interface ExecuteParams {
  language: string
  code: string
  input: string
}

export interface ExecuteResult {
  stdout: string
  stderr: string
  executionTime: number
  memoryUsed: number
  exitCode: number
}

const LANGUAGE_CONFIG: Record<string, { image: string; cmd: string[] }> = {
  python: { image: 'python:3.11-alpine', cmd: ['python', 'main.py'] },
  javascript: { image: 'node:18-alpine', cmd: ['node', 'main.js'] },
  java: { image: 'eclipse-temurin:17-jdk-alpine', cmd: ['sh', '-c', 'javac Main.java && java Main'] },
  cpp: { image: 'gcc:12-alpine', cmd: ['sh', '-c', 'g++ -o main main.cpp && ./main'] },
  c: { image: 'gcc:12-alpine', cmd: ['sh', '-c', 'gcc -o main main.c && ./main'] },
  go: { image: 'golang:1.21-alpine', cmd: ['go', 'run', 'main.go'] },
}

const FILE_EXTENSIONS: Record<string, string> = {
  python: 'py',
  javascript: 'js',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
}

export class DockerExecutor {
  async execute(params: ExecuteParams): Promise<ExecuteResult> {
    const { language, code, input } = params
    const languageConfig = LANGUAGE_CONFIG[language]

    if (!languageConfig) {
      throw new Error(`Unsupported language: ${language}`)
    }

    const containerId = uuidv4()
    // Use a shared directory that's accessible from both the backend container and host
    const tempDir = path.join('/tmp/online-compiler', `code-exec-${containerId}`)
    
    // Create temp directory
    await fs.mkdir(tempDir, { recursive: true })

    try {
      // Write code to file
      const fileName = language === 'java' ? 'Main.java' : `main.${FILE_EXTENSIONS[language]}`
      const filePath = path.join(tempDir, fileName)
      await fs.writeFile(filePath, code)

      // Pull image if not exists
      await this.ensureImage(languageConfig.image)

      // Create container
      const startTime = Date.now()
      const container = await docker.createContainer({
        Image: languageConfig.image,
        Cmd: languageConfig.cmd,
        WorkingDir: '/workspace',
        HostConfig: {
          Binds: [`${tempDir}:/workspace`],
          Memory: config.maxMemory * 1024 * 1024, // Convert MB to bytes
          MemorySwap: config.maxMemory * 1024 * 1024,
          CpuQuota: Math.floor(config.maxCpuCores * 100000),
          CpuPeriod: 100000,
          NetworkMode: 'none',
          ReadonlyRootfs: false,
        },
        OpenStdin: true,
        StdinOnce: true,
      })

      // Start container
      await container.start()

      // Send input if provided
      if (input) {
        const stream = await container.attach({
          stream: true,
          stdin: true,
          stdout: true,
          stderr: true,
        })
        stream.write(input)
        stream.end()
      }

      // Wait for container with timeout
      const waitPromise = container.wait()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Execution timeout')), config.maxExecutionTime * 1000)
      )

      await Promise.race([waitPromise, timeoutPromise])

      const executionTime = Date.now() - startTime

      // Get logs - Docker uses multiplexed stream format
      const logs = await container.logs({
        stdout: true,
        stderr: true,
      })

      // Parse Docker's multiplexed stream format
      // Format: [stream_type, 0, 0, 0, size1, size2, size3, size4, ...data...]
      let stdout = ''
      let stderr = ''
      
      const logBuffer = logs as Buffer
      
      if (Buffer.isBuffer(logBuffer)) {
        let offset = 0
        while (offset < logBuffer.length) {
          // Docker stream header is 8 bytes
          if (offset + 8 > logBuffer.length) break
          
          const streamType = logBuffer[offset]
          const size = logBuffer.readUInt32BE(offset + 4)
          
          if (offset + 8 + size > logBuffer.length) break
          
          const data = logBuffer.slice(offset + 8, offset + 8 + size).toString('utf8')
          
          if (streamType === 1) {
            stdout += data
          } else if (streamType === 2) {
            stderr += data
          }
          
          offset += 8 + size
        }
      } else {
        // Fallback for non-buffer logs
        stdout = String(logBuffer)
      }

      // Get stats
      const stats = await container.stats({ stream: false })
      const memoryUsed = stats.memory_stats.usage 
        ? Math.round(stats.memory_stats.usage / 1024) 
        : 0 // Convert to KB

      // Get exit code
      const inspect = await container.inspect()
      const exitCode = inspect.State.ExitCode || 0

      // Cleanup
      await container.remove({ force: true })
      await fs.rm(tempDir, { recursive: true, force: true })

      return {
        stdout: stdout.slice(0, config.maxOutputSize * 1024),
        stderr: stderr.slice(0, config.maxOutputSize * 1024),
        executionTime,
        memoryUsed,
        exitCode,
      }
    } catch (error) {
      // Cleanup on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      
      logger.error('Docker execution error:', error)
      throw error
    }
  }

  private async ensureImage(imageName: string): Promise<void> {
    try {
      await docker.getImage(imageName).inspect()
    } catch {
      logger.info(`Pulling image: ${imageName}`)
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err: any, stream: any) => {
          if (err) return reject(err)
          docker.modem.followProgress(stream, (err: any) => {
            if (err) return reject(err)
            resolve(null)
          })
        })
      })
    }
  }
}
