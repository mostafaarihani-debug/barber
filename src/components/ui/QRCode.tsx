import React, { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import QRCodeLib from 'qrcode'

interface QRCodeProps {
  value?: string
  size?: number | string
  bgColor?: string
  fgColor?: string
  className?: string
}

export function downloadQRCode(
  value: string,
  size = 400,
  bgColor = '#0B0B0B',
  fgColor = '#C9A227',
  filename = 'barber-qr.png'
) {
  const canvas = document.createElement('canvas')
  QRCodeLib.toCanvas(
    canvas,
    value,
    {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: 'H',
    },
    (err) => {
      if (err) {
        console.error('QR download failed', err)
        return
      }
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  )
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
    return 'https://barber-booking-app.pages.dev/barber/demo'
  }, [value])

  return (
    <div
      className={className}
      data-qr-value={resolvedValue}
      style={{
        background: bgColor,
        padding: 8,
        borderRadius: 12,
        display: 'inline-block',
        lineHeight: 0,
      }}
    >
      <QRCodeSVG
        value={resolvedValue}
        size={sizeNum}
        bgColor={bgColor}
        fgColor={fgColor}
        level="H"
        marginSize={1}
      />
    </div>
  )
}

export default QRCode
