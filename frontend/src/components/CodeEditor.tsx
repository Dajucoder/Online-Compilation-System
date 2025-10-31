import { Editor as MonacoEditor } from '@monaco-editor/react'
import { Spin } from 'antd'

interface CodeEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language: string
  height?: string
}

export default function CodeEditor({
  value,
  onChange,
  language,
  height = '600px',
}: CodeEditorProps) {
  return (
    <MonacoEditor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      loading={<Spin size="large" />}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 2,
      }}
    />
  )
}
