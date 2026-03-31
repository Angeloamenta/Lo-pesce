import React, { useEffect, useRef } from 'react';
import './PlanktonCanvas.css';

export default function PlanktonCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // 150 mini particelle luminose per imitare polviscolo/plancton in sospensione
    const numParticles = 150;
    const particles = [];
    
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.2, // Estremamente piccoli
            // Movimento random lentissimo su tutti gli assi
            speedX: (Math.random() - 0.5) * 0.3, 
            speedY: (Math.random() - 0.5) * 0.3,
            baseOpacity: Math.random() * 0.5 + 0.1, // Semi-trasparenti
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Spostamento fluido
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Pulviscolo pulsa leggermente (luce)
        p.pulsePhase += p.pulseSpeed;
        const currentOpacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.2;
        
        // Wraparound schermo continuo per tenerli sempre in scena
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 255, ${Math.max(0, currentOpacity)})`;
        ctx.fill();
        
        // Leggero bagliore/alone solo per i puntini più grossi
        if(p.radius > 1) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 255, 255, ${Math.max(0, currentOpacity * 0.2)})`;
            ctx.fill();
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="plankton-canvas"></canvas>;
}
