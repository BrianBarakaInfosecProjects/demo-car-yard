'use client'

import { useState }                    from 'react'
import { shareCar, type ShareableCar } from '@/lib/sharecar'

interface Props {
  car:     ShareableCar
  variant?: 'default' | 'icon-only' | 'full-width' | 'overlay'
}

export default function ShareButton({ car, variant = 'default' }: Props) {
  const [state, setState] = useState<
    'idle' | 'loading' | 'shared' | 'copied' | 'error'
  >('idle')

  const handleShare = async () => {
    setState('loading')
    
    try {
      const result = await shareCar(car)
      console.log('Share result:', result)

      if (result === 'shared')      setState('shared')
      else if (result === 'copied') setState('copied')
      else if (result === 'cancelled') setState('idle')
      else if (result === 'unsupported') {
        // Clipboard failed - show alert as last resort
        const url = `${window.location.origin}/cars/${car.slug}`
        const caption = `${car.year} ${car.make} ${car.model} - KES ${car.price.toLocaleString()}\n${url}`
        prompt('Copy this to share:', caption)
        setState('idle')
        return
      }
      else setState('error')
    } catch (err) {
      console.error('Share error:', err)
      setState('error')
    }

    // Reset after 3 seconds
    if (state !== 'idle' && state !== 'loading') {
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const label = {
    idle:    'Share',
    loading: 'Opening...',
    shared:  'Shared!',
    copied:  'Copied!',
    error:   'Try again',
  }[state]

  const showLabel = variant !== 'icon-only'
  const showOverlayFeedback = variant === 'overlay' && (state === 'copied' || state === 'shared')

  const icon = (
    state === 'copied' || state === 'shared' ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5"  r="3"/>
        <circle cx="6"  cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
      </svg>
    )
  )

  const baseClass = `
    flex items-center justify-center gap-2 
    border transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    text-sm font-medium
  `

  const stateClass =
    state === 'shared' || state === 'copied'
      ? 'border-green-500 text-green-500 bg-green-500/20'
      : state === 'error'
      ? 'border-red-500 text-red-500'
      : 'border-border-subtle text-text-secondary hover:border-accent hover:text-accent'

  const variantClass = {
    'default':    'rounded-lg px-4 py-2',
    'icon-only':  'rounded-lg p-2',
    'full-width': 'rounded-lg px-4 py-3 w-full',
    'overlay':    'rounded-lg p-2 bg-black/40 backdrop-blur-sm border-white/20 text-white hover:bg-black/60',
  }[variant]

  return (
    <button
      onClick={handleShare}
      disabled={state === 'loading'}
      aria-label="Share this car"
      className={`${baseClass} ${stateClass} ${variantClass} ${showOverlayFeedback ? '!border-green-400 !text-green-400 !bg-green-900/50' : ''}`}
    >
      {icon}
      {showLabel && <span>{label}</span>}
      {showOverlayFeedback && (
        <span className="text-xs ml-1">✓</span>
      )}
    </button>
  )
}
