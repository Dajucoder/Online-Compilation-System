import { ReactNode } from 'react'
import { Layout as AntLayout } from 'antd'
import Header from './Header'
import './Layout.css'

const { Content, Footer } = AntLayout

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AntLayout className="min-h-screen">
      <Header />
      <Content className="site-layout-content">
        {children}
      </Content>
      <Footer className="text-center bg-gray-100">
        在线编译系统 ©{new Date().getFullYear()} Created by Dajucoder
      </Footer>
    </AntLayout>
  )
}
