import { useMemo } from 'react'
import parse from 'html-react-parser'
import sanitizeHtml from 'sanitize-html'

const RichTextDisplay = ({
  content,
  className = '',
  maxLength,
  showReadMore = false
}) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return ''

    const cleanContent = sanitizeHtml(content, {
      allowedTags: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'sub',
        'sup',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'pre',
        'code',
        'a',
        'iframe',
        'div',
        'span'
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        iframe: ['src', 'frameborder', 'allowfullscreen'],
        '*': ['class', 'style']
      },
      allowedStyles: {
        '*': {
          color: [/.*/],
          'background-color': [/.*/]
        }
      }
    })

    if (maxLength && cleanContent.length > maxLength) {
      return cleanContent.substring(0, maxLength) + (showReadMore ? '...' : '')
    }

    return cleanContent
  }, [content, maxLength, showReadMore])

  if (!content) return null

  return (
    <div className={`rich-text-display ${className}`}>
      {parse(sanitizedContent)}
    </div>
  )
}

export default RichTextDisplay
