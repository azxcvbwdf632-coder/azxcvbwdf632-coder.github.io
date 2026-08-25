import {
  fallbackToJpg,
  responsiveImageProps,
  responsiveSourceSet,
} from '../imageSupport'

export default function ResponsiveImage({
  src,
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) {
  const imageProps = responsiveImageProps(src, sizes)
  const avifSrcSet = responsiveSourceSet(src, 'avif')
  const webpSrcSet = responsiveSourceSet(src, 'webp')

  const image = (
    <img
      {...props}
      {...imageProps}
      loading={loading}
      decoding={decoding}
      onError={(event) => {
        fallbackToJpg(event)
        onError?.(event)
      }}
    />
  )

  if (!avifSrcSet) return image

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      {webpSrcSet ? <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} /> : null}
      {image}
    </picture>
  )
}
