let webpSupport

export function supportsWebP() {
  if (webpSupport !== undefined) return webpSupport

  try {
    const canvas = document.createElement('canvas')
    webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } catch {
    webpSupport = false
  }

  return webpSupport
}

export function compatibleImageSrc(src) {
  if (!src || supportsWebP() || !/\.webp(?:$|\?)/i.test(src)) return src
  return src.replace(/\.webp(?=$|\?)/i, '.jpg')
}

export function jpgFallbackSrc(src) {
  if (!src || !/\.webp(?:$|\?)/i.test(src)) return null
  return src.replace(/\.webp(?=$|\?)/i, '.jpg')
}

export function fallbackToJpg(event) {
  const image = event.currentTarget
  if (!image || image.dataset.jpgFallbackTried === 'true') return false

  const fallback = jpgFallbackSrc(image.currentSrc || image.src)
  if (!fallback) return false

  image.dataset.jpgFallbackTried = 'true'

  // A selected <picture> source takes precedence over the img src. Disable
  // those sources after a real request failure so the JPG can be retried.
  const picture = image.closest?.('picture')
  picture?.querySelectorAll('source').forEach((source) => {
    source.srcset = ''
  })

  image.src = fallback
  return true
}

export function markImageSupport() {
  document.documentElement.classList.add(supportsWebP() ? 'supports-webp' : 'no-webp')
}
