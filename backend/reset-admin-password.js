const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetPassword() {
  try {
    const username = 'admin'
    const newPassword = 'admin123456' // 新密码

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      console.log('❌ 用户不存在!')
      return
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新密码
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    })

    console.log('✅ 密码重置成功!')
    console.log('='.repeat(50))
    console.log('👤 用户名:', username)
    console.log('🔑 新密码:', newPassword)
    console.log('='.repeat(50))
    console.log('⚠️  请使用新密码登录!')

  } catch (error) {
    console.error('❌ 重置密码失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()
