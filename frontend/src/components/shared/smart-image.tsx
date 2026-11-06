import React, { useState } from 'react';
import { resolveImageSource, getInlineFallbackSvg, type MediaKind } from '@/lib/media/image-resolver';
import { cn } from '@/lib/utils';

export interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  kind?: MediaKind;
  fallback?: string;
  containerClassName?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9' | 'auto';
}

export function SmartImage({
  src,
  alt,
  kind = 'project',
  fallback,
  className,
  containerClassName,
  aspectRatio,
  loading = 'lazy',
  ...rest
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  const resolved = resolveImageSource(src, { kind, fallback });
  const displaySrc = hasError ? (fallback || getInlineFallbackSvg(alt, kind)) : resolved;

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-video'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '21/9'
      ? 'aspect-[21/9]'
      : '';

  return (
    <div className={cn('overflow-hidden relative', aspectClass, containerClassName)}>
      <img
        src={displaySrc}
        alt={alt}
        loading={loading}
        onError={() => setHasError(true)}
        className={cn('w-full h-full object-cover transition-opacity duration-300', className)}
        {...rest}
      />
    </div>
  );
}
