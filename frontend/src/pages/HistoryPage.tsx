import { Card, Table, Tag, Button, Space } from 'antd'
import { Eye, Share2, Trash2 } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'

interface SubmissionRecord {
  id: string
  language: string
  code: string
  status: string
  executionTime: number
  createdAt: string
}

export default function HistoryPage() {
  // Mock data
  const data: SubmissionRecord[] = [
    {
      id: '1',
      language: 'python',
      code: 'print("Hello")',
      status: 'success',
      executionTime: 45,
      createdAt: '2025-10-31 10:30:00',
    },
  ]

  const columns: ColumnsType<SubmissionRecord> = [
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
      render: (lang: string) => <Tag color="blue">{lang.toUpperCase()}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '执行时间',
      dataIndex: 'executionTime',
      key: 'executionTime',
      render: (time: number) => `${time}ms`,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<Eye size={16} />}>查看</Button>
          <Button type="link" icon={<Share2 size={16} />}>分享</Button>
          <Button type="link" danger icon={<Trash2 size={16} />}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <Card title="提交历史">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  )
}
