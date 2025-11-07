import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from '../config'
import { logger } from '../utils/logger'
import { AppError } from '../middleware/errorHandler'

const prisma = new PrismaClient()

export class AuthController {
  async register(req: Request, res: Response) {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      throw new AppError('用户名或邮箱已存在', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    )

    logger.info(`User registered: ${user.email}`)

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    })
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('邮箱或密码错误', 401)
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    )

    logger.info(`User logged in: ${user.email}`)

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    })
  }

  async getProfile(req: any, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({
      status: 'success',
      data: { user },
    })
  }
}
