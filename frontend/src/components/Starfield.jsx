import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;
    let stars = [];
    let animationFrameId;

    // Resize handler with High-DPI support
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;
      
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      ctx.scale(dpr, dpr);
      
      initStars(logicalWidth, logicalHeight);
    };

    // Initialize stars (dynamic density based on viewport size)
    const initStars = (width, height) => {
      stars = [];
      // Calculate dynamic count: ~1 star per 10,000 pixels, bounded between 50 and 200
      const area = width * height;
      const starCount = Math.min(Math.max(Math.floor(area / 10000), 50), 200);

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.4, // Stars between 0.4px and 1.6px for crisp look
          speedFactor: Math.random() * 0.3 + 0.05, // Parallax depth factor
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2, // Starting phase for twinkling sine wave
          baseOpacity: Math.random() * 0.5 + 0.5
        });
      }
    };

    // Scroll tracking
    let lastScrollY = window.scrollY;
    let currentScrollY = window.scrollY;

    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial setup
    resizeCanvas();

    // Animation Loop
    const render = () => {
      // Clear with matte black background
      ctx.fillStyle = '#050508'; 
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Smooth scroll interpolation
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY += scrollDiff * 0.15; // Smooth dampening

      stars.forEach(star => {
        // Calculate scroll-based downward drift with parallax depth
        let yPos = star.y - (lastScrollY * star.speedFactor);
        
        // Wrap stars vertically so they loop seamlessly in logical height
        yPos = ((yPos % logicalHeight) + logicalHeight) % logicalHeight;

        // Twinkle effect (sine wave fluctuation)
        star.phase += star.twinkleSpeed;
        const opacity = star.baseOpacity * (0.3 + 0.7 * Math.sin(star.phase));

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, yPos, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
};

export default Starfield;
