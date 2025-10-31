const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { username: 'admin' } 
    });
    
    console.log('用户名:', user.username);
    console.log('密码哈希前缀:', user.password.substring(0, 30) + '...');
    
    const isValid = await bcrypt.compare('admin123456', user.password);
    console.log('密码验证结果:', isValid ? '✅ 成功' : '❌ 失败');
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
