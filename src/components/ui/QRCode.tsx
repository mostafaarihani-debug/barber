import React from 'react'
import { useTranslation } from 'react-i18next'

const QRCode: React.FC = ({ size = 200, bgColor = '#0B0B0B', fgColor = '#C9A227' }) => {
  const { t } = useTranslation()

  // In a real app, this would generate a real QR code using a library
  // For now, we'll create a placeholder SVG that looks like a QR code
  const sizeNum = typeof size === 'string' ? parseInt(size) : size

  // Simple placeholder QR code pattern
  const qrSize = sizeNum
  const moduleSize = qrSize / 21 // Standard QR code is 21x21 modules
  const border = 4

  // Generate a simple pattern based on the URL hash
  // This is a placeholder - in production, use a proper QR code library
  const url = window.location.origin + window.location.pathname
  const hash = url.split('/').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const modules = []
  for (let row = 0; row < 21; row++) {
    for (let col = 0; col < 21; col++) {
      // Simple deterministic pattern based on position
      const isDark = (row + col + Math.floor(hash / 21)) % 2 === 0
      modules.push(
        <rect
          key={`${row}-${col}`}
          x={col * moduleSize}
          y={row * moduleSize}
          width={moduleSize - 1}
          height={moduleSize - 1}
          fill={isDark ? fgColor : bgColor}
        />
      )
    }
  }

  return (
    <svg
      width={qrSize}
      height={qrSize}
      viewBox={`0 0 ${qrSize} ${qrSize}`}
      className="bg-[var(--bg)]"
    >
      <rect width="100%" height="100%" fill={bgColor} />
      {modules}
    </svg>
  )
}

export default QRCode