export interface ShareableCar {
  make:      string
  model:     string
  year:      number
  price:     number
  imageUrl:  string
  slug:      string
  mileage?:  number
  fuelType?: string
}

export function buildShareCaption(car: ShareableCar): string {
  const price = car.price.toLocaleString('en-KE')
  const mileage = car.mileage
    ? `\n🛣️  ${car.mileage.toLocaleString()} km`
    : ''
  const fuel = car.fuelType
    ? `\n⛽ ${car.fuelType}`
    : ''

  return (
    `🚗 ${car.year} ${car.make} ${car.model}\n` +
    `💰 KES ${price}` +
    mileage +
    fuel +
    `\n📍 Nairobi, Kenya\n\n` +
    `View this car 👇`
  )
}

export function buildShareUrl(slug: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/cars/${slug}`
}

export async function shareCar(car: ShareableCar): Promise<
  'shared' | 'copied' | 'unsupported' | 'cancelled'
> {
  const url     = buildShareUrl(car.slug)
  const caption = buildShareCaption(car)
  const title   = `${car.year} ${car.make} ${car.model}`

  console.log('Attempting share:', { title, url, hasImage: !!car.imageUrl })

  // --- Attempt 1: Share with image file (best experience) ---
  if (navigator.share) {
    console.log('Web Share API available')
    try {
      if (!car.imageUrl) {
        throw new Error('No image URL')
      }
      const response = await fetch(car.imageUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }
      const blob     = await response.blob()
      const ext      = blob.type.includes('png') ? 'png' : 'jpg'
      const file     = new File(
        [blob],
        `${car.make}-${car.model}-${car.year}.${ext}`,
        { type: blob.type }
      )

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        console.log('Sharing with image...')
        await navigator.share({ title, text: caption, files: [file], url })
        return 'shared'
      }
    } catch (err: any) {
      console.log('Image share failed:', err.message || err.name)
      if (err.name === 'AbortError') return 'cancelled'
    }

    // --- Attempt 2: Share without image (text + url only) ---
    try {
      console.log('Trying text-only share...')
      await navigator.share({ title, text: caption, url })
      return 'shared'
    } catch (err: any) {
      console.log('Text share failed:', err.message || err.name)
      if (err.name === 'AbortError') return 'cancelled'
    }
  } else {
    console.log('Web Share API NOT available - will use clipboard')
  }

  // --- Attempt 3: Copy to clipboard (desktop fallback) ---
  try {
    console.log('Attempting clipboard copy...')
    await navigator.clipboard.writeText(`${caption}\n${url}`)
    console.log('Clipboard copy SUCCESS')
    return 'copied'
  } catch (err) {
    console.error('Clipboard copy FAILED:', err)
    return 'unsupported'
  }
}
