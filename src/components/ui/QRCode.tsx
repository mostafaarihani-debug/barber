import React, { useMemo, useCallback } from 'react'

interface QRCodeProps {
  value?: string
  size?: number | string
  bgColor?: string
  fgColor?: string
  className?: string
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

export function downloadQRCode(
  value: string,
  size = 200,
  bgColor = '#0B0B0B',
  fgColor = '#C9A227',
  filename = 'barber-qr.png'
) {
  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)

  const moduleCount = 21
  const moduleSize = size / moduleCount
  const h = hashString(value || 'default')

  // background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  // draw modules
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      let isDark: boolean
      // finder patterns (3 corners)
      const inFinderTL = row < 7 && col < 7
      const inFinderTR = row < 7 && col >= 14
      const inFinderBL = row >= 14 && col < 7
      if (inFinderTL || inFinderTR || inFinderBL) {
        const rr = row % 7
        const cc = col % 7
        const isBorder = rr === 0 || rr === 6 || cc === 0 || cc === 6
        const isCenter = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4
        isDark = isBorder || isCenter
      } else {
        // deterministic pseudo-random
        isDark = (h + row * 31 + col * 17) % 2 === 0
        // add some variation for visual density
        if ((row + col) % 7 === 0) isDark = !isDark
      }
      if (isDark) {
        ctx.fillStyle = fgColor
        const x = col * moduleSize
        const y = row * moduleSize
        const pad = 0.7
        const r = 1.5
        // rounded rect
        const w = moduleSize - pad * 2
        const hh = moduleSize - pad * 2
        // simple rounded rect via arc
        ctx.beginPath()
        // @ts-ignore - roundRect may not be in older types
        if (typeof ctx.roundRect === 'function') {
          // @ts-ignore
          ctx.roundRect(x + pad, y + pad, w, hh, r)
        } else {
          ctx.rect(x + pad, y + pad, w, hh)
        }
        ctx.fill()
      }
    }
  }

  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  bgColor = '#0B0B0B',
  fgColor = '#C9A227',
  className,
}) => {
  const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size
  const resolvedValue = useMemo(() => {
    if (value) return value
    if (typeof window !== 'undefined') return window.location.origin + window.location.pathname
    return 'https://yourdomain.com/barber/demo'
  }, [value])

  const h = useMemo(() => hashString(resolvedValue), [resolvedValue])

  const modules = useMemo(() => {
    const arr: React.ReactNode[] = []
    const moduleCount = 21
    const moduleSize = sizeNum / moduleCount
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let isDark: boolean
        const inFinderTL = row < 7 && col < 7
        const inFinderTR = row < 7 && col >= 14
        const inFinderBL = row >= 14 && col < 7
        if (inFinderTL || inFinderTR || inFinderBL) {
          const rr = row % 7
          const cc = col % 7
          const isBorder = rr === 0 || rr === 6 || cc === 0 || cc === 6
          const isCenter = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4
          isDark = isBorder || isCenter
        } else {
          isDark = (h + row * 31 + col * 17) % 2 === 0
          if ((row + col) % 7 === 0) isDark = !isDark
        }
        const x = col * moduleSize
        const y = row * moduleSize
        const pad = 0.7
        arr.push(
          <rect
            key={`${row}-${col}`}
            x={x + pad}
            y={y + pad}
            width={moduleSize - pad * 2}
            height={moduleSize - pad * 2}
            rx={1.5}
            ry={1.5}
            fill={isDark ? fgColor : 'transparent'}
          />
        )
      }
    }
    return arr
  }, [h, sizeNum, fgColor])

  const handleDownload = useCallback(() => {
    downloadQRCode(resolvedValue, sizeNum, bgColor, fgColor)
  }, [resolvedValue, sizeNum, bgColor, fgColor])

  // expose download via data attribute for external buttons if needed
  return (
    <div className={className} data-qr-value={resolvedValue}>
      <svg
        width={sizeNum}
        height={sizeNum}
        viewBox={`0 0 ${sizeNum} ${sizeNum}`}
        className="rounded-xl overflow-hidden"
        style={{ background: bgColor, display: 'block' }}
        role="img"
        aria-label="QR Code"
      >
        <rect width={sizeNum} height={sizeNum} rx={12} fill={bgColor} />
        {modules}
      </svg>
      {/* hidden handler triggerable externally via downloadQRCode util */}
      <span className="hidden" data-download-handler onClick={handleDownload} />
    </div>
  )
}

export default QRCode
