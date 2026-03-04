import { useMemo, useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const RichTextEditorClient = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  height = '200px',
  theme = 'snow',
  label,
  error,
  required = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => setIsFullscreen(prev => !prev)

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
    }
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isFullscreen])

  const modules = useMemo(
    () => ({
      toolbar: readOnly
        ? false
        : {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ size: ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ align: [] }],
              ['blockquote', 'code-block'],
              ['clean']
            ]
          },
      clipboard: { matchVisual: false }
    }),
    [readOnly]
  )

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'blockquote',
    'code-block',
    'link',
    'clean'
  ]

  const handleChange = content => {
    if (onChange) onChange(content)
  }

  const expandBtnStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 10,
    padding: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center'
  }

  const iconStyle = { width: '16px', height: '16px' }

  return (
    <>
      {/* Normal mode */}
      <div
        className="rich-text-editor-wrapper"
        style={{
          marginBottom: '24px',
          display: isFullscreen ? 'none' : 'block'
        }}
      >
        {label && (
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px'
            }}
          >
            {label}
            {required && (
              <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
            )}
          </div>
        )}
        <div
          className={`rich-text-editor${readOnly ? ' read-only' : ''}`}
          style={{ position: 'relative' }}
        >
          {!readOnly && (
            <button
              type="button"
              onClick={toggleFullscreen}
              style={expandBtnStyle}
              title="Expand to fullscreen"
            >
              <ArrowsPointingOutIcon style={iconStyle} />
            </button>
          )}
          <ReactQuill
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder}
            readOnly={readOnly}
            theme={theme}
            modules={modules}
            formats={formats}
            style={{
              height: readOnly ? 'auto' : height,
              minHeight: readOnly ? 'auto' : height
            }}
          />
        </div>
        {error && (
          <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>
            {error}
          </p>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fullscreen-modal">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 500,
                color: '#111827',
                margin: 0
              }}
            >
              {label || 'Rich Text Editor'}
              {required && (
                <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
              )}
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={toggleFullscreen}
                style={{
                  ...expandBtnStyle,
                  position: 'static',
                  padding: '8px'
                }}
                title="Exit fullscreen"
              >
                <ArrowsPointingInIcon
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                style={{
                  ...expandBtnStyle,
                  position: 'static',
                  padding: '8px'
                }}
                title="Close"
              >
                <XMarkIcon style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
            <div
              className="rich-text-editor fullscreen-editor"
              style={{ height: '100%' }}
            >
              <ReactQuill
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                readOnly={readOnly}
                theme={theme}
                modules={modules}
                formats={formats}
                style={{ height: 'calc(100% - 42px)' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Press ESC to exit fullscreen
            </span>
            <button
              type="button"
              onClick={toggleFullscreen}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Done
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '16px',
                background: '#fef2f2',
                borderTop: '1px solid #fecaca'
              }}
            >
              <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>
                {error}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RichTextEditorClient
