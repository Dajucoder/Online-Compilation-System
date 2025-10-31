import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { config } from '../config'
import { AppError } from '../middleware/errorHandler'

const prisma = new PrismaClient()

export class AuthController {
  async register(req: Request, res: Response) {
    const { username, email, password } = req.body

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })

    if (existingUser) {
      throw new AppError('Username or email already exists', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    })

    res.status(201).json({
      status: 'success',
      data: { user },
    })
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body

    // 添加调试日志
    console.log('=== 登录请求调试信息 ===')
    console.log('收到的用户名:', username, '(类型:', typeof username, ', 长度:', username?.length, ')')
    console.log('收到的密码:', password?.substring(0, 10) + '...', '(类型:', typeof password, ', 长度:', password?.length, ')')
    console.log('请求体:', JSON.stringify(req.body))

    const user = await prisma.user.findUnique({
      where: { username },
    })

    console.log('数据库查询结果:', user ? `找到用户 ${user.username}` : '用户不存在')
    
    if (!user) {
      console.log('❌ 用户不存在')
      throw new AppError('Invalid credentials', 401)
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log('密码验证结果:', passwordMatch ? '✅ 匹配' : '❌ 不匹配')

    if (!passwordMatch) {
      console.log('❌ 密码错误')
      throw new AppError('Invalid credentials', 401)
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    )

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    })
  }
}
