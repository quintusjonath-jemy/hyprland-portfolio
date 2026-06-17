import React, { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : canvas.height + 10;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = (Math.random() * 0.005) + 0.002;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        
        // Neon color palette (Tokyo Night colors)
        const colors = [
          'rgba(187, 154, 252, ', // Purple
          'rgba(125, 207, 255, ', // Cyan
          'rgba(247, 118, 142, ', // Pink/Red
          'rgba(158, 206, 106, '  // Green
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update(mouseX, mouseY) {
        this.y += this.speedY;
        this.x += this.speedX;

        // Pulse opacity
        this.opacity += this.fadeSpeed * this.direction;
        if (this.opacity > 0.8) {
          this.direction = -1;
        } else if (this.opacity < 0.1) {
          this.direction = 1;
        }

        // Mouse avoidance/attraction
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const force = (120 - distance) / 120;
            this.x += (dx / distance) * force * 1.5;
            this.y += (dy / distance) * force * 1.5;
          }
        }

        // Reset if off-screen
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${this.opacity})`;
        
        // Add subtle neon glow to larger particles
        if (this.size > 2) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `${this.colorPrefix}0.6)`;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Track mouse position
    let mouseX = null;
    let mouseY = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85
      }}
    />
  );
};

export default BackgroundCanvas;
