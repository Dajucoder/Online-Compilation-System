import { useState, useEffect } from 'react'
import { Card, Select, Button, Input, Row, Col, Tabs, Tag, Space, Alert } from 'antd'
import { Play, Save, Share2, Clock, MemoryStick } from 'lucide-react'
import { toast } from 'react-hot-toast'
import CodeEditor from '@/components/CodeEditor'
import { useExecuteCode } from '@/hooks/useExecuteCode'
import { useAuthStore } from '@/store/authStore'

const { TextArea } = Input

export default function EditorPage() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(getDefaultCode('python'))
  const [input, setInput] = useState('')
  
  const { execute, result, isLoading } = useExecuteCode()
  const { token, isAuthenticated, user } = useAuthStore()
  
  // Debug: Log auth state
  useEffect(() => {
    console.log('EditorPage - Auth State:', {
      isAuthenticated,
      hasToken: !!token,
      tokenLength: token?.length,
      user
    })
  }, [isAuthenticated, token, user])

  const languages = [
    { value: 'python', label: 'Python 3.11', mode: 'python' },
    { value: 'java', label: 'Java 17', mode: 'java' },
    { value: 'cpp', label: 'C++ (GCC 11)', mode: 'cpp' },
    { value: 'c', label: 'C (GCC 11)', mode: 'c' },
    { value: 'javascript', label: 'JavaScript (Node 18)', mode: 'javascript' },
    { value: 'go', label: 'Go 1.21', mode: 'go' },
  ]

  function getDefaultCode(lang: string): string {
    const templates: Record<string, string> = {
      python: '# Python 代码\nprint("Hello, World!")\n',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
      javascript: '// JavaScript 代码\nconsole.log("Hello, World!");\n',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
    }
    return templates[lang] || ''
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setCode(getDefaultCode(value))
  }

  const handleRun = async () => {
    try {
      await execute({ language, code, input })
    } catch (error) {
      toast.error('执行失败')
    }
  }

  const handleSave = () => {
    toast.success('代码已保存')
  }

  const handleShare = () => {
    toast.success('分享链接已复制到剪贴板')
  }

  const tabItems = [
    {
      key: 'output',
      label: '输出',
      children: (
        <div className="p-4 bg-gray-900 text-green-400 rounded font-mono text-sm min-h-[200px] whitespace-pre-wrap">
          {result?.stdout || '等待执行...'}
        </div>
      ),
    },
    {
      key: 'error',
      label: '错误',
      children: (
        <div className="p-4 bg-gray-900 text-red-400 rounded font-mono text-sm min-h-[200px] whitespace-pre-wrap">
          {result?.stderr || '无错误'}
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <Row gutter={[16, 16]}>
          {/* 左侧编辑器 */}
          <Col xs={24} lg={14}>
            <div className="mb-4 flex items-center justify-between">
              <Select
                value={language}
                onChange={handleLanguageChange}
                style={{ width: 200 }}
                options={languages}
              />
              <Space>
                <Button icon={<Save size={16} />} onClick={handleSave}>
                  保存
                </Button>
                <Button icon={<Share2 size={16} />} onClick={handleShare}>
                  分享
                </Button>
                <Button
                  type="primary"
                  icon={<Play size={16} />}
                  onClick={handleRun}
                  loading={isLoading}
                >
                  运行
                </Button>
              </Space>
            </div>

            <CodeEditor
              value={code}
              onChange={(value) => setCode(value || '')}
              language={languages.find((l) => l.value === language)?.mode || 'python'}
              height="500px"
            />
          </Col>

          {/* 右侧输入输出 */}
          <Col xs={24} lg={10}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">标准输入</h3>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此输入程序的标准输入..."
                rows={8}
                className="font-mono"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">执行结果</h3>
                {result && (
                  <Space size="large">
                    <Tag icon={<Clock size={14} />} color="blue">
                      {result.executionTime}ms
                    </Tag>
                    <Tag icon={<MemoryStick size={14} />} color="green">
                      {result.memoryUsed}KB
                    </Tag>
                  </Space>
                )}
              </div>
              <Tabs items={tabItems} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
