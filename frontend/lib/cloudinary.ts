export function cloudinaryUrl(
  rawUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  if (!rawUrl || !rawUrl.includes('cloudinary.com')) return rawUrl;

  const {
    width = 800,
    quality = 90,
    format = 'auto',
  } = options;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `w_${width}`,
    options.height ? `h_${options.height}` : null,
    'c_fill',
    'dpr_auto',
  ].filter(Boolean).join(',');

  return rawUrl.replace('/upload/', `/upload/${transforms}/`);
}

export function gridImage(url: string): string {
  return cloudinaryUrl(url, { width: 800, quality: 90 });
}

export function detailImage(url: string): string {
  return cloudinaryUrl(url, { width: 1400, quality: 92 });
}

export function thumbnailImage(url: string): string {
  return cloudinaryUrl(url, { width: 200, height: 150, quality: 85 });
}

export function adminThumbnail(url: string): string {
  return cloudinaryUrl(url, { width: 400, quality: 80 });
}
