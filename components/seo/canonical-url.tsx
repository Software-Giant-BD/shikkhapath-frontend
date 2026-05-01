'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function CanonicalUrl() {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shikkhapath.com'

  useEffect(() => {
    const canonicalUrl = `${baseUrl}${pathname}`

    const existingLink = document.querySelector('link[rel="canonical"]')
    if (existingLink) {
      existingLink.remove()
    }

    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = canonicalUrl
    document.head.appendChild(link)

    return () => {
      const linkToRemove = document.querySelector('link[rel="canonical"]')
      if (linkToRemove) {
        linkToRemove.remove()
      }
    }
  }, [pathname, baseUrl])

  return null
}
