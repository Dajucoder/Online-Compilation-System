import { useState } from 'react'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'

const { Title, Text } = Typography

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login', values)
      const { user, token } = response.data.data
      login(user, token)
      message.success('登录成功！')
      navigate('/')
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>登录</Title>
          <Text type="secondary">使用您的账号登录在线编译系统</Text>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          <div className="text-center">
            <Text>没有账号？</Text>
            <Link to="/register" className="text-blue-600 hover:text-blue-500 ml-1">
              立即注册
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
