import { useRef, useEffect } from 'react';
import './ChromaKeyVideo.css';

export default function ChromaKeyVideo({ 
  src, 
  className = "", 
  colorToReplace = { r: 0, g: 255, b: 0 }, 
  similarity = 95, 
  smoothness = 30 
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Ensure video is playing
    video.muted = true;
    video.play().catch(e => console.error("Auto-play prevented", e));
    
    let animationFrameId;

    const processFrame = () => {
      animationFrameId = requestAnimationFrame(processFrame);
      
      if (video.paused || video.ended) {
        return;
      }
      
      // Downscale video for processing only if it's extremely large
      // 1280 width retains excellent HD quality while saving some CPU over full 4K processing.
      const MAX_WIDTH = 1280;
      let width = video.videoWidth;
      let height = video.videoHeight;
      
      if (!width || !height) return;

      if (width > MAX_WIDTH) {
        height = Math.floor((MAX_WIDTH / width) * height);
        width = MAX_WIDTH;
      }

      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      ctx.drawImage(video, 0, 0, width, height);
      
      try {
        const frame = ctx.getImageData(0, 0, width, height);
        
        // Deep Optimization: Cast the Uint8ClampedArray directly to a 32-bit unsigned integer array.
        // This processes pixels 4x faster since we read/write an entire pixel (ARGB/ABGR) in one JS operation!
        const data32 = new Uint32Array(frame.data.buffer);
        const len = data32.length;
        
        // Note: Typed arrays in JS are typically little-endian. Colors map to A-B-G-R bytes.
        for (let i = 0; i < len; i++) {
          const pixel = data32[i];
          const r = pixel & 0xFF;
          const g = (pixel >> 8) & 0xFF;
          const b = (pixel >> 16) & 0xFF;
          
          if (g > 30 && g > r * 0.8 && g > b * 0.8) {
            const avgRB = (r + b) >> 1; // Bitwise division by 2
            const greenness = g - avgRB;
            
            if (greenness > similarity) {
              // Target completely transparent - wipe out the alpha byte (top 8 bits)
              data32[i] &= 0x00FFFFFF; 
            } else if (greenness > similarity - smoothness) {
              // Smooth transition
              const alphaRatio = (greenness - (similarity - smoothness)) / smoothness;
              let newAlpha = 255 - ~~(alphaRatio * 255); // ~~ is fast Math.floor
              if (newAlpha < 0) newAlpha = 0;
              
              const newG = g < avgRB ? g : avgRB; // Fast Math.min
              
              // Reconstruct the 32-bit pixel: [Alpha][Blue][Green][Red]
              data32[i] = (newAlpha << 24) | (b << 16) | (newG << 8) | r;
            }
          }
        }
        
        ctx.putImageData(frame, 0, 0);
      } catch (err) { }
    };

    video.addEventListener('play', () => {
      animationFrameId = requestAnimationFrame(processFrame);
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [src, similarity, smoothness, colorToReplace]);

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
        preload="metadata"
        crossOrigin="anonymous"
      />
      <canvas ref={canvasRef} className="chroma-video-canvas" />
    </div>
  );
}
