import imageManifest from './imageManifest'

let webpSupport

function sourceKey(src) {
  return src?.split('?')[0] || ''
}

export function responsiveSourceSet(src, format = 'webp') {
  const candidates = imageManifest[sourceKey(src)]?.[format]
  if (!candidates?.length) return undefined
  return candidates.map((candidate) => `${candidate.src} ${candidate.width}w`).join(', ')
}

export function responsiveImageProps(src, sizes = '100vw') {
  if (!src) return { src: undefined }
  const metadata = imageManifest[sourceKey(src)]
  const srcSet = supportsWebP() && /\.webp(?:$|\?)/i.test(src)
    ? responsiveSourceSet(src, 'webp')
    : undefined

  return {
    src: compatibleImageSrc(src),
    srcSet,
    sizes: srcSet ? sizes : undefined,
    width: metadata?.width,
    height: metadata?.height,
  }
}

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
  if (!src || !/\.(?:webp|avif)(?:$|\?)/i.test(src)) return null
  return src
    .replace(/-w\d+\.(?:webp|avif)(?=$|\?)/i, '.jpg')
    .replace(/\.(?:webp|avif)(?=$|\?)/i, '.jpg')
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

  image.removeAttribute('srcset')
  image.removeAttribute('sizes')
  image.src = fallback
  return true
}

export function markImageSupport() {
  document.documentElement.classList.add(supportsWebP() ? 'supports-webp' : 'no-webp')
}
