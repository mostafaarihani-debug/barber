import { useEffect } from 'react'

type SEOProps = {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article' | 'profile'
}

/**
 * SEO component for dynamic meta tags
 * Updates document head with proper SEO metadata
 */
export const useSEO = ({ title, description, image, type = 'website' }: SEOProps) => {
  useEffect(() => {
    // Update page title
    document.title = `${title} | Premium Barber Booking`

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      ;(metaDescription as any).content = ''
      document.head.appendChild(metaDescription)
    }
    ;(metaDescription as any).content = description

    // Update Open Graph metadata
    const updateOG = (props: { property: string; content: string }) => {
      let meta = document.querySelector(`meta[property="${props.property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', props.property)
        ;(meta as any).content = ''
        document.head.appendChild(meta)
      }
      ;(meta as any).content = props.content
    }

    updateOG({ property: 'og:title', content: title })
    updateOG({ property: 'og:description', content: description })
    updateOG({ property: 'og:type', content: type })
    updateOG({ property: 'og:url', content: window.location.href })
    if (image) {
      updateOG({ property: 'og:image', content: image })
    }

    // Update Twitter Card metadata
    let twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (!twitterCard) {
      twitterCard = document.createElement('meta')
      twitterCard.name = 'twitter:card'
      ;(twitterCard as any).content = ''
      document.head.appendChild(twitterCard)
    }
    twitterCard!.content = 'summary_large_image'

    let twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta')
      twitterTitle.name = 'twitter:title'
      ;(twitterTitle as any).content = ''
      document.head.appendChild(twitterTitle)
    }
    twitterTitle!.content = title

    let twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta')
      twitterDescription.name = 'twitter:description'
      ;(twitterDescription as any).content = ''
      document.head.appendChild(twitterDescription)
    }
    twitterDescription!.content = description

    let twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (!twitterImage) {
      twitterImage = document.createElement('meta')
      twitterImage.name = 'twitter:image'
      ;(twitterImage as any).content = ''
      document.head.appendChild(twitterImage)
    }
    if (image) {
      twitterImage!.content = image
    }

    // Cleanup on unmount
    return () => {
      // No cleanup needed for dynamically added metas in most cases
    }
  }, [title, description, image, type])
}