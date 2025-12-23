/**
 * Rich Content Module for a11y-feedback v2.0
 * Handles rendering of rich content (icons, images, links) in notifications
 * @module rich-content
 */

import type { RichContent, RichContentImage, RichContentLink } from '../types'
import { CSS_CLASSES_V2 } from '../constants'
import { getConfig } from '../config'

/**
 * Allowlist of safe HTML tags for sanitization
 */
const SAFE_TAGS = new Set([
  'b', 'i', 'u', 'strong', 'em', 'br', 'span', 'p', 
  'ul', 'ol', 'li', 'code', 'pre', 'mark', 'small'
])

/**
 * Allowlist of safe attributes
 */
const SAFE_ATTRIBUTES = new Set([
  'class', 'id', 'aria-label', 'aria-hidden', 'role'
])

/**
 * Sanitize HTML content to prevent XSS
 * 
 * @param html - Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
  // Create a temporary element to parse HTML
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Recursively clean nodes
  const cleanNode = (node: Node): void => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const tagName = el.tagName.toLowerCase()

      // Remove unsafe elements
      if (!SAFE_TAGS.has(tagName)) {
        el.replaceWith(...Array.from(el.childNodes))
        return
      }

      // Remove unsafe attributes
      Array.from(el.attributes).forEach(attr => {
        if (!SAFE_ATTRIBUTES.has(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name)
        }
      })

      // Remove event handlers
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name)
        }
      })
    }

    // Process children
    Array.from(node.childNodes).forEach(cleanNode)
  }

  cleanNode(temp)
  return temp.innerHTML
}

/**
 * Render an icon element
 * 
 * @param icon - SVG string, SVGElement, or factory function
 * @returns Icon container element
 */
export function renderIcon(
  icon: string | SVGElement | (() => SVGElement)
): HTMLElement {
  const container = document.createElement('div')
  container.className = CSS_CLASSES_V2.richIcon
  container.setAttribute('aria-hidden', 'true')

  if (typeof icon === 'string') {
    // SVG string
    container.innerHTML = sanitizeSVG(icon)
  } else if (typeof icon === 'function') {
    // Factory function
    const svgEl = icon()
    container.appendChild(svgEl)
  } else if (icon instanceof SVGElement) {
    // SVGElement
    container.appendChild(icon.cloneNode(true))
  }

  return container
}

/**
 * Sanitize SVG content
 * 
 * @param svg - Raw SVG string
 * @returns Sanitized SVG string
 */
function sanitizeSVG(svg: string): string {
  // Create a temporary element to parse SVG
  const temp = document.createElement('div')
  temp.innerHTML = svg

  // Remove script elements and event handlers
  const scripts = temp.querySelectorAll('script')
  scripts.forEach(s => s.remove())

  // Remove event handlers from all elements
  const allElements = temp.querySelectorAll('*')
  allElements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return temp.innerHTML
}

/**
 * Render an image element with proper accessibility
 * 
 * @param image - Image configuration
 * @returns Image element or null if invalid
 */
export function renderImage(image: RichContentImage): HTMLElement | null {
  if (!image.src || !image.alt) {
    if (getConfig().debug) {
      console.warn('[a11y-feedback] Image missing required src or alt')
    }
    return null
  }

  const container = document.createElement('div')
  container.className = CSS_CLASSES_V2.richImage

  const img = document.createElement('img')
  img.src = image.src
  img.alt = image.alt
  img.loading = 'lazy'
  
  if (image.width) {
    img.width = image.width
  }
  if (image.height) {
    img.height = image.height
  }

  // Handle image load errors
  img.onerror = (): void => {
    container.style.display = 'none'
    if (getConfig().debug) {
      console.warn('[a11y-feedback] Image failed to load:', image.src)
    }
  }

  container.appendChild(img)
  return container
}

/**
 * Render a link element with proper accessibility
 * 
 * @param link - Link configuration
 * @returns Link element
 */
export function renderLink(link: RichContentLink): HTMLElement {
  const a = document.createElement('a')
  a.className = CSS_CLASSES_V2.richLink
  a.href = link.href
  a.textContent = link.text

  if (link.external) {
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    
    // Add visual indicator for external links
    const indicator = document.createElement('span')
    indicator.className = 'a11y-feedback-external-icon'
    indicator.setAttribute('aria-hidden', 'true')
    indicator.innerHTML = '↗'
    a.appendChild(indicator)

    // Screen reader text for external link
    const srText = document.createElement('span')
    srText.className = 'a11y-sr-only'
    srText.textContent = ' (opens in new tab)'
    a.appendChild(srText)
  }

  if (link.ariaLabel) {
    a.setAttribute('aria-label', link.ariaLabel)
  }

  return a
}

/**
 * Render rich content for a notification
 * 
 * @param content - Rich content configuration
 * @param baseMessage - Base message to include if no description
 * @returns Rich content container element
 */
export function renderRichContent(
  content: RichContent,
  baseMessage?: string
): HTMLElement {
  const container = document.createElement('div')
  container.className = CSS_CLASSES_V2.richContent

  // Icon
  if (content.icon) {
    container.appendChild(renderIcon(content.icon))
  }

  // Content wrapper
  const contentWrapper = document.createElement('div')
  contentWrapper.className = 'a11y-feedback-rich-body'

  // Title
  if (content.title) {
    const title = document.createElement('div')
    title.className = CSS_CLASSES_V2.richTitle
    title.textContent = content.title
    contentWrapper.appendChild(title)
  }

  // Description
  if (content.description || baseMessage) {
    const description = document.createElement('div')
    description.className = CSS_CLASSES_V2.richDescription
    description.textContent = content.description || baseMessage || ''
    contentWrapper.appendChild(description)
  }

  // Custom HTML (sanitized)
  if (content.html) {
    const htmlContainer = document.createElement('div')
    htmlContainer.className = 'a11y-feedback-rich-html'
    htmlContainer.innerHTML = sanitizeHTML(content.html)
    contentWrapper.appendChild(htmlContainer)
  }

  // Image
  if (content.image) {
    const imageEl = renderImage(content.image)
    if (imageEl) {
      contentWrapper.appendChild(imageEl)
    }
  }

  // Link
  if (content.link) {
    const linkWrapper = document.createElement('div')
    linkWrapper.className = 'a11y-feedback-rich-link-wrapper'
    linkWrapper.appendChild(renderLink(content.link))
    contentWrapper.appendChild(linkWrapper)
  }

  container.appendChild(contentWrapper)
  return container
}

/**
 * Generate text content for screen reader announcement from rich content
 * 
 * @param content - Rich content configuration
 * @param baseMessage - Base message
 * @returns Screen reader text
 */
export function getRichContentText(
  content: RichContent,
  baseMessage?: string
): string {
  const parts: string[] = []

  if (content.title) {
    parts.push(content.title)
  }

  if (content.description) {
    parts.push(content.description)
  } else if (baseMessage) {
    parts.push(baseMessage)
  }

  if (content.link) {
    parts.push(`Link: ${content.link.text}`)
  }

  if (content.image?.alt) {
    parts.push(`Image: ${content.image.alt}`)
  }

  return parts.join('. ')
}

/**
 * Built-in icons for common feedback types
 */
export const BUILTIN_ICONS = {
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  
  loading: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
} as const

/**
 * Get the built-in icon for a feedback type
 * 
 * @param type - Feedback type
 * @returns SVG string
 */
export function getBuiltinIcon(type: keyof typeof BUILTIN_ICONS): string {
  return BUILTIN_ICONS[type]
}

/**
 * Generate CSS for rich content
 */
export function getRichContentCSS(): string {
  return `
    .${CSS_CLASSES_V2.richContent} {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .${CSS_CLASSES_V2.richIcon} {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${CSS_CLASSES_V2.richIcon} svg {
      width: 100%;
      height: 100%;
    }

    .a11y-feedback-rich-body {
      flex: 1;
      min-width: 0;
    }

    .${CSS_CLASSES_V2.richTitle} {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }

    .${CSS_CLASSES_V2.richDescription} {
      font-size: 0.875rem;
      opacity: 0.9;
      line-height: 1.5;
    }

    .a11y-feedback-rich-html {
      font-size: 0.875rem;
      line-height: 1.5;
      margin-top: 0.5rem;
    }

    .a11y-feedback-rich-html code {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-family: ui-monospace, monospace;
      font-size: 0.85em;
    }

    .${CSS_CLASSES_V2.richImage} {
      margin-top: 0.75rem;
      max-width: 100%;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .${CSS_CLASSES_V2.richImage} img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .a11y-feedback-rich-link-wrapper {
      margin-top: 0.75rem;
    }

    .${CSS_CLASSES_V2.richLink} {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--a11y-feedback-link-color, #60a5fa);
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: color 0.15s ease;
    }

    .${CSS_CLASSES_V2.richLink}:hover {
      color: var(--a11y-feedback-link-hover, #93c5fd);
    }

    .${CSS_CLASSES_V2.richLink}:focus {
      outline: 2px solid var(--a11y-feedback-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .a11y-feedback-external-icon {
      font-size: 0.8em;
    }

    .a11y-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .${CSS_CLASSES_V2.richLink} {
        transition: none;
      }
    }
  `
}

