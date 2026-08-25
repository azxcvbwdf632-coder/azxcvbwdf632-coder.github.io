import { useEffect, useState } from 'react'
import {
  jpgFallbackSrc,
  responsiveImageProps,
  responsiveSourceSet,
} from '../imageSupport'

export default function ResponsiveImage({
  src,
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  onError,
  onLoad,
  fallbackLabel,
  ...props
}) {
  const [fallbackSrc, setFallbackSrc] = useState(null)
  const [failed, setFailed] = useState(false)
  const imageProps = responsiveImageProps(src, sizes)
  const fallbackCandidate = jpgFallbackSrc(src)
  const avifSrcSet = fallbackSrc ? undefined : responsiveSourceSet(src, 'avif')
  const webpSrcSet = fallbackSrc ? undefined : responsiveSourceSet(src, 'webp')
  const renderedImageProps = fallbackSrc
    ? {
        src: fallbackSrc,
        width: imageProps.width,
        height: imageProps.height,
      }
    : imageProps

  useEffect(() => {
    setFallbackSrc(null)
    setFailed(false)
  }, [src])

  const image = (
    <img
      {...props}
      {...renderedImageProps}
      loading={loading}
      decoding={decoding}
      data-image-state={failed ? 'failed' : fallbackSrc ? 'fallback' : 'primary'}
      onError={(event) => {
        if (!fallbackSrc && fallbackCandidate) {
          setFallbackSrc(fallbackCandidate)
          return
        }
        if (failed) return
        setFailed(true)
        onError?.(event)
      }}
      onLoad={(event) => {
        setFailed(false)
        onLoad?.(event)
      }}
    />
  )

  const responsiveImage = avifSrcSet ? (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
      {image}
    </picture>
  ) : image

  return (
    <>
      {responsiveImage}
      {failed && fallbackLabel ? (
        <div className="poster-load-fallback" role="status">{fallbackLabel}</div>
      ) : null}
    </>
  )
}
