import { Layout, Menu, Button, Avatar, Dropdown } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, User, LogOut, History, Home } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import type { MenuProps } from 'antd'

const { Header: AntHeader } = Layout

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'history',
      icon: <History size={16} />,
      label: '历史记录',
      onClick: () => navigate('/history'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      onClick: logout,
    },
  ]

  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <Home size={16} />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'editor',
      icon: <Code2 size={16} />,
      label: <Link to="/editor">代码编辑器</Link>,
    },
  ]

  return (
    <AntHeader className="flex items-center justify-between px-6 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Code2 size={28} />
          <span>在线编译系统</span>
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          className="flex-1 border-0"
          style={{ minWidth: 0 }}
        />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <Avatar icon={<User size={16} />} />
              <span>{user.username}</span>
            </div>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <Button type="default" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </div>
        )}
      </div>
    </AntHeader>
  )
}
