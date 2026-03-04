import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('./RichTextEditorClient'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: '12px',
        color: '#9ca3af',
        border: '1px solid #e5e7eb',
        borderRadius: '6px'
      }}
    >
      Loading editor...
    </div>
  )
})

export default RichTextEditor
