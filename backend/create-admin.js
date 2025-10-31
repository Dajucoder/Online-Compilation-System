const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // 从环境变量读取管理员信息，如果未设置则使用默认值
    const adminData = {
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123456',
    }

    // 检查是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: adminData.username },
          { email: adminData.email },
        ],
      },
    })

    if (existingUser) {
      console.log('ℹ️  管理员账号已存在，跳过创建')
      return
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    // 创建管理员
    const admin = await prisma.user.create({
      data: {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
      },
    })

    console.log('✅ 管理员账号创建成功!')
    console.log('='.repeat(50))
    console.log('📧 邮箱:', admin.email)
    console.log('👤 用户名:', admin.username)
    console.log('🔑 初始密码:', adminData.password)
    console.log('='.repeat(50))
    console.log('⚠️  请立即登录并修改密码!')

  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
