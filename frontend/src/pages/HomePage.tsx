import { Button, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Code2, Zap, Shield, Globe } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Code2 size={48} className="text-blue-500" />,
      title: '多语言支持',
      description: '支持Python、Java、C/C++、JavaScript、Go等主流编程语言',
    },
    {
      icon: <Zap size={48} className="text-yellow-500" />,
      title: '快速执行',
      description: '基于Docker容器，代码执行快速高效，秒级响应',
    },
    {
      icon: <Shield size={48} className="text-green-500" />,
      title: '安全隔离',
      description: '沙箱环境执行，确保代码安全，资源限制保护系统',
    },
    {
      icon: <Globe size={48} className="text-purple-500" />,
      title: '随时随地',
      description: '无需安装任何环境，在浏览器中即可编写和运行代码',
    },
  ]

  const languages = [
    { name: 'Python', version: '3.11', color: 'bg-blue-500' },
    { name: 'Java', version: '17', color: 'bg-red-500' },
    { name: 'C/C++', version: 'GCC 11', color: 'bg-gray-700' },
    { name: 'JavaScript', version: 'Node 18', color: 'bg-yellow-500' },
    { name: 'Go', version: '1.21', color: 'bg-cyan-500' },
    { name: 'Rust', version: '1.70', color: 'bg-orange-500' },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          在线编译系统
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          随时随地，在线编写、编译和运行代码
        </p>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate('/editor')}
          className="text-lg h-12 px-8"
        >
          开始编码
        </Button>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">核心特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Languages Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-10">支持的语言</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map((lang, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div
                className={`${lang.color} text-white rounded-lg py-4 mb-2`}
              >
                <div className="text-2xl font-bold">{lang.name}</div>
              </div>
              <div className="text-gray-600 text-sm">{lang.version}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-xl mb-6">立即体验强大的在线编程环境</p>
        <Button
          type="default"
          size="large"
          onClick={() => navigate('/editor')}
          className="text-lg h-12 px-8"
        >
          立即开始
        </Button>
      </div>
    </div>
  )
}
