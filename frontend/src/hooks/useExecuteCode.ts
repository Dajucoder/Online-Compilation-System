import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/services/api'

interface ExecuteCodeParams {
  language: string
  code: string
  input?: string
}

interface ExecutionResult {
  stdout: string
  stderr: string
  executionTime: number
  memoryUsed: number
  exitCode: number
  status: string
}

interface Submission {
  id: string
  status: string
  result?: ExecutionResult
}

export function useExecuteCode() {
  const [result, setResult] = useState<ExecutionResult | null>(null)

  const pollForResult = async (submissionId: string): Promise<ExecutionResult> => {
    const maxAttempts = 30 // 最多等待30秒
    const interval = 1000 // 每秒轮询一次

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await api.get(`/execute/${submissionId}`)
      const submission: Submission = response.data.data.submission

      if (submission.status === 'completed' && submission.result) {
        return {
          ...submission.result,
          status: 'completed'
        }
      }

      if (submission.status === 'failed') {
        throw new Error('代码执行失败')
      }

      // 等待后继续轮询
      await new Promise(resolve => setTimeout(resolve, interval))
    }

    throw new Error('执行超时，请重试')
  }

  const mutation = useMutation({
    mutationFn: async (params: ExecuteCodeParams) => {
      // 提交代码执行请求
      const submitResponse = await api.post('/execute', params)
      const submissionId = submitResponse.data.data.submissionId

      // 轮询获取结果
      const result = await pollForResult(submissionId)
      return result
    },
    onSuccess: (data: ExecutionResult) => {
      setResult(data)
    },
  })

  return {
    execute: mutation.mutate,
    result,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
