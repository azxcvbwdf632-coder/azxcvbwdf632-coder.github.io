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

export function markImageSupport() {
  document.documentElement.classList.add(supportsWebP() ? 'supports-webp' : 'no-webp')
}
