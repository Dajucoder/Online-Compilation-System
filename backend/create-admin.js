const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // 管理员信息
    const adminData = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123456', // 请在实际使用中修改此密码
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
      console.log('❌ 管理员账号已存在!')
      console.log(`用户名: ${existingUser.username}`)
      console.log(`邮箱: ${existingUser.email}`)
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
    console.log('🔑 密码:', adminData.password)
    console.log('='.repeat(50))
    console.log('⚠️  请立即登录并修改密码!')

  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
