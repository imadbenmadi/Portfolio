import { useMemo } from 'react'
import parse from 'html-react-parser'
import DOMPurify from 'isomorphic-dompurify'

const RichTextDisplay = ({
  content,
  className = '',
  maxLength,
  showReadMore = false
}) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return ''

    const cleanContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
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
      ALLOWED_ATTR: [
        'href',
        'target',
        'rel',
        'class',
        'style',
        'color',
        'background-color',
        'frameborder',
        'allowfullscreen'
      ],
      ALLOW_DATA_ATTR: false
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
