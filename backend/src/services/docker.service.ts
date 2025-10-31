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
  java: { image: 'openjdk:17-alpine', cmd: ['sh', '-c', 'javac Main.java && java Main'] },
  cpp: { image: 'gcc:11-alpine', cmd: ['sh', '-c', 'g++ -o main main.cpp && ./main'] },
  c: { image: 'gcc:11-alpine', cmd: ['sh', '-c', 'gcc -o main main.c && ./main'] },
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
    const tempDir = path.join('/tmp', `code-exec-${containerId}`)
    
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

      // Get logs
      const logs = await container.logs({
        stdout: true,
        stderr: true,
      })

      const output = logs.toString('utf8')
      const lines = output.split('\n')
      const stdout = lines.filter((l) => !l.startsWith('Error:')).join('\n')
      const stderr = lines.filter((l) => l.startsWith('Error:')).join('\n')

      // Get stats
      const stats = await container.stats({ stream: false })
      const memoryUsed = Math.round(stats.memory_stats.usage / 1024) // Convert to KB

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
