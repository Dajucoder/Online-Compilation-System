import { ReactNode } from 'react'
import { Layout as AntLayout, Menu, Button, Dropdown, Space, Typography } from 'antd'
import { UserOutlined, LogoutOutlined, CodeOutlined, HistoryOutlined, HomeOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const { Header, Content, Footer } = AntLayout
const { Title } = Typography

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人资料',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'history',
        icon: <HistoryOutlined />,
        label: '执行历史',
        onClick: () => navigate('/history'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  }

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/editor',
      icon: <CodeOutlined />,
      label: <Link to="/editor">代码编辑器</Link>,
    },
    ...(isAuthenticated
      ? [
          {
            key: '/history',
            icon: <HistoryOutlined />,
            label: <Link to="/history">执行历史</Link>,
          },
        ]
      : []),
  ]

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
          <Link to="/" className="flex items-center">
            <Title level={3} className="mb-0 text-blue-600">
              🚀 在线编译系统
            </Title>
          </Link>

          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="border-none flex-1 mx-8"
          />

          <div className="flex items-center">
            {isAuthenticated ? (
              <Dropdown menu={userMenu} trigger={['click']}>
                <Button type="text" className="flex items-center">
                  <Space>
                    <UserOutlined />
                    {user?.username}
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Link to="/login">
                  <Button type="text">登录</Button>
                </Link>
                <Link to="/register">
                  <Button type="primary">注册</Button>
                </Link>
              </Space>
            )}
          </div>
        </div>
      </Header>

      <Content className="flex-1">
        {children}
      </Content>

      <Footer className="text-center">
        在线编译系统 ©2025 基于 Docker + React + Node.js 构建
      </Footer>
    </AntLayout>
  )
}
