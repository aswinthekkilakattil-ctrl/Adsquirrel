import { useEffect, useRef } from 'react'
import './ChromaKeyVideo.css'

export default function ChromaKeyVideo({
  src,
  className = '',
  colorToReplace = { r: 0, g: 255, b: 0 },
  similarity = 95,
  smoothness = 30,
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return undefined

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return undefined

    let animationFrameId = 0
    let retryTimeoutId = 0
    let disposed = false

    const stopProcessing = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = 0
      }
    }

    const processFrame = () => {
      if (disposed) return
      animationFrameId = requestAnimationFrame(processFrame)

      if (video.paused || video.ended || video.readyState < 2) {
        return
      }

      const MAX_WIDTH = 1280
      let width = video.videoWidth
      let height = video.videoHeight

      if (!width || !height) return

      if (width > MAX_WIDTH) {
        height = Math.floor((MAX_WIDTH / width) * height)
        width = MAX_WIDTH
      }

      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height

      ctx.drawImage(video, 0, 0, width, height)

      try {
        const frame = ctx.getImageData(0, 0, width, height)
        const data32 = new Uint32Array(frame.data.buffer)
        const len = data32.length

        for (let i = 0; i < len; i += 1) {
          const pixel = data32[i]
          const r = pixel & 0xff
          const g = (pixel >> 8) & 0xff
          const b = (pixel >> 16) & 0xff

          if (g > 30 && g > r * 0.8 && g > b * 0.8) {
            const avgRB = (r + b) >> 1
            const greenness = g - avgRB

            if (greenness > similarity) {
              data32[i] &= 0x00ffffff
            } else if (greenness > similarity - smoothness) {
              const alphaRatio = (greenness - (similarity - smoothness)) / smoothness
              let newAlpha = 255 - ~~(alphaRatio * 255)
              if (newAlpha < 0) newAlpha = 0

              const newG = g < avgRB ? g : avgRB
              data32[i] = (newAlpha << 24) | (b << 16) | (newG << 8) | r
            }
          }
        }

        ctx.putImageData(frame, 0, 0)
      } catch {
        // Ignore transient canvas read errors during media startup.
      }
    }

    const startProcessing = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(processFrame)
      }
    }

    const queuePlayRetry = () => {
      if (disposed || retryTimeoutId) return

      retryTimeoutId = window.setTimeout(() => {
        retryTimeoutId = 0
        attemptPlayback()
      }, 500)
    }

    const attemptPlayback = () => {
      if (disposed) return

      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      video.setAttribute('muted', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('autoplay', '')

      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          queuePlayRetry()
        })
      }
    }

    const handleCanPlay = () => {
      attemptPlayback()
    }

    const handlePlay = () => {
      startProcessing()
    }

    const handlePause = () => {
      if (!video.ended) {
        queuePlayRetry()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        attemptPlayback()
      }
    }

    video.addEventListener('loadeddata', handleCanPlay)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('playing', handlePlay)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    attemptPlayback()

    return () => {
      disposed = true
      stopProcessing()

      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId)
      }

      video.pause()
      video.removeEventListener('loadeddata', handleCanPlay)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('playing', handlePlay)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [src, similarity, smoothness, colorToReplace])

  return (
    <div className={`chroma-video-container ${className}`}>
      <video
        ref={videoRef}
        src={src}
        style={{ display: 'none' }}
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} className="chroma-video-canvas" />
    </div>
  )
}
