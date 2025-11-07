import { Card, Typography } from 'antd'
import { Code2, Rocket, Users, Shield } from 'lucide-react'

const { Title, Paragraph } = Typography

export default function HomePage() {
  const features = [
    {
      icon: <Code2 size={40} />,
      title: '多语言支持',
      description: '支持 Python, Java, C/C++, JavaScript, Go 等多种编程语言',
    },
    {
      icon: <Rocket size={40} />,
      title: '高性能执行',
      description: '基于 Docker 容器技术，安全高效的代码运行环境',
    },
    {
      icon: <Users size={40} />,
      title: '用户管理',
      description: '完整的用户注册登录系统，支持代码历史管理',
    },
    {
      icon: <Shield size={40} />,
      title: '安全可靠',
      description: '资源限制、网络隔离、多层安全保护机制',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title level={1} className="mb-4">
          🚀 在线编译系统
        </Title>
        <Paragraph className="text-xl text-gray-600 mb-8">
          一个强大的在线代码编译与运行平台，支持多种编程语言，安全隔离的代码执行环境。
        </Paragraph>
        <div className="space-x-4">
          <a href="/editor" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            开始编码
          </a>
          <a href="/login" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
            用户登录
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4 flex justify-center">
              {feature.icon}
            </div>
            <Title level={4} className="mb-2">
              {feature.title}
            </Title>
            <Paragraph className="text-gray-600">
              {feature.description}
            </Paragraph>
          </Card>
        ))}
      </div>

      {/* Supported Languages */}
      <div className="mt-16 text-center">
        <Title level={2} className="mb-8">
          支持的编程语言
        </Title>
        <div className="flex flex-wrap justify-center gap-4">
          {['Python', 'Java', 'C++', 'C', 'JavaScript', 'Go'].map((lang) => (
            <span key={lang} className="bg-gray-100 px-4 py-2 rounded-full">
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
