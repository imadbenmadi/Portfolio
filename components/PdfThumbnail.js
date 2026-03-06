import { useEffect, useRef, useState } from 'react'
import { Box, Center, Image, useColorModeValue } from '@chakra-ui/react'
import { IoDocumentText } from 'react-icons/io5'

export default function PdfThumbnail({
  url,
  alt,
  boxSize = '56px',
  borderRadius = 'md',
  borderColor,
  borderWidth = '1px'
}) {
  const canvasRef = useRef(null)
  const [renderedUrl, setRenderedUrl] = useState(null)
  const [failed, setFailed] = useState(false)
  const bg = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    let cancelled = false
    setRenderedUrl(null)
    setFailed(false)

    async function run() {
      if (!url) return
      try {
        const mod = await import('pdfjs-dist/legacy/build/pdf')
        const pdfjs = mod?.default || mod

        // Use CDN worker to avoid bundler/worker config complexity in Next pages.
        // If the CDN fails, we fall back to the icon.
        const version = pdfjs?.version || '4.10.38'
        if (pdfjs?.GlobalWorkerOptions) {
          // Use CDN worker to avoid bundler/worker config issues in Next (Pages Router).
          // jsDelivr hosts the worker for the exact pdfjs-dist version.
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
        }

        // Some hosts/CDNs don't support PDF.js range requests reliably.
        // Disabling range/stream makes fetching more compatible (at the cost of downloading the full PDF).
        const loadingTask = pdfjs.getDocument({
          url,
          disableRange: true,
          disableStream: true
        })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)

        const viewport = page.getViewport({ scale: 1 })
        const canvas = canvasRef.current
        if (!canvas || cancelled) return

        // Fit page into a square thumbnail
        const targetSize = 256
        const scale = targetSize / Math.max(viewport.width, viewport.height)
        const scaledViewport = page.getViewport({ scale })

        canvas.width = Math.ceil(scaledViewport.width)
        canvas.height = Math.ceil(scaledViewport.height)

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas unsupported')

        await page.render({ canvasContext: ctx, viewport: scaledViewport })
          .promise
        if (cancelled) return

        // Convert to image so Chakra layout stays consistent
        const dataUrl = canvas.toDataURL('image/png')
        if (!cancelled) setRenderedUrl(dataUrl)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [url])

  if (failed) {
    return (
      <Center
        boxSize={boxSize}
        borderRadius={borderRadius}
        bg={bg}
        borderWidth={borderWidth}
        borderColor={borderColor}
        flexShrink={0}
      >
        <Box as={IoDocumentText} boxSize="24px" />
      </Center>
    )
  }

  if (renderedUrl) {
    return (
      <Image
        src={renderedUrl}
        alt={alt || 'PDF thumbnail'}
        boxSize={boxSize}
        objectFit="cover"
        borderRadius={borderRadius}
        borderWidth={borderWidth}
        borderColor={borderColor}
        flexShrink={0}
      />
    )
  }

  // Hidden canvas used for rendering
  return (
    <Center
      boxSize={boxSize}
      borderRadius={borderRadius}
      bg={bg}
      borderWidth={borderWidth}
      borderColor={borderColor}
      flexShrink={0}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Box as={IoDocumentText} boxSize="24px" opacity={0.7} />
    </Center>
  )
}
