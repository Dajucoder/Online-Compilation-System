import { useState, useEffect } from 'react'
import { Table, Card, Typography, Tag, Space, Button } from 'antd'
import { HistoryOutlined, ClockCircleOutlined, DatabaseOutlined } from '@ant-design/icons'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'

const { Title } = Typography

interface Submission {
  id: string
  language: string
  code: string
  input: string
  status: string
  createdAt: string
  result?: {
    stdout: string
    stderr: string
    executionTime: number
    memoryUsed: number
    exitCode: number
  }
}

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (token) {
      fetchSubmissions()
    }
  }, [token])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const response = await api.get('/submissions')
      setSubmissions(response.data.data.submissions)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      render: (language: string) => (
        <Tag color="blue">{language.toUpperCase()}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap = {
          pending: 'orange',
          running: 'blue',
          completed: 'green',
          failed: 'red',
        }
        return <Tag color={colorMap[status as keyof typeof colorMap]}>{status}</Tag>
      },
    },
    {
      title: '执行时间',
      key: 'executionTime',
      render: (_: any, record: Submission) => {
        if (record.result) {
          return (
            <Space>
              <ClockCircleOutlined />
              {record.result.executionTime}ms
            </Space>
          )
        }
        return '-'
      },
    },
    {
      title: '内存使用',
      key: 'memoryUsed',
      render: (_: any, record: Submission) => {
        if (record.result) {
          return (
            <Space>
              <DatabaseOutlined />
              {record.result.memoryUsed}KB
            </Space>
          )
        }
        return '-'
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString('zh-CN'),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <Title level={2}>
            <HistoryOutlined className="mr-2" />
            执行历史
          </Title>
          <Button onClick={fetchSubmissions} loading={loading}>
            刷新
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={submissions}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}
