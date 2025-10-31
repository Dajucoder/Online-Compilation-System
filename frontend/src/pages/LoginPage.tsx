import { Form, Input, Button, Card } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    try {
      await login(values)
      toast.success('登录成功')
      navigate('/editor')
    } catch (error) {
      toast.error('登录失败，请检查用户名和密码')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-134px)]">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">用户登录</h2>
        <Form form={form} onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>

          <div className="text-center">
            还没有账号？<Link to="/register" className="text-blue-600">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
