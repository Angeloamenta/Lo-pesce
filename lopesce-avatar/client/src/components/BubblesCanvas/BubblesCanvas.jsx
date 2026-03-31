import React, { useEffect, useRef } from 'react';
import './BubblesCanvas.css';

export default function BubblesCanvas() {
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

    // Quante bolle far apparire a schermo in ogni momento
    const numBubbles = 40;
    const bubbles = [];

    function createBubble(w, h, startAtBottom = false) {
      const radius = Math.random() * 10 + 1.5; // Bolle tra piccolissime e medie
      return {
        x: Math.random() * w,
        y: startAtBottom ? h + radius * 2 + Math.random() * 50 : Math.random() * h,
        radius: radius,
        // Fluidodinamica base: le bolle grandi hanno più "galleggiabilità" e salgono un filo più veloci
        speedY: (Math.random() * 0.6 + 0.2) * ((radius * 0.15) + 0.8),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01, // Wobble meno frenetico per maggior realismo
        wobbleAmplitude: Math.random() * (radius * 0.8), // Si spostano proporzionalmente in base alla taglia
        opacity: Math.random() * 0.3 + 0.1 // Mai completamente bianche
      };
    }

    for (let i = 0; i < numBubbles; i++) {
      bubbles.push(createBubble(width, height));
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        
        // Aggiorna posizione
        b.y -= b.speedY;
        b.wobble += b.wobbleSpeed;
        
        // Tremolio orizzontale fisicamente corretto
        const currentX = b.x + Math.sin(b.wobble) * b.wobbleAmplitude;
        
        // Disegna bolla base
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        
        // Rendering illuminotecnico avanzato: luce speculare in alto a sinistra
        const gradient = ctx.createRadialGradient(
          currentX - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.05,
          currentX, b.y, b.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.min(b.opacity + 0.5, 1)})`); // Hotspot luminoso croccante
        gradient.addColorStop(0.3, `rgba(255, 255, 255, 0.0)`); // Il corpo centrale dell'aria è invisibile sott'acqua
        gradient.addColorStop(0.8, `rgba(200, 240, 255, ${b.opacity * 0.3})`); // Tinta leggermente azzurrina
        gradient.addColorStop(1, `rgba(200, 240, 255, ${b.opacity})`); // Bordo della sacca d'aria
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Filo visivo finissimo attorno
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.6})`;
        ctx.stroke();

        // Riflesso speculare secondario sottile (in basso a destra)
        if (b.radius > 3) {
          ctx.beginPath();
          ctx.arc(currentX + b.radius * 0.4, b.y + b.radius * 0.4, b.radius * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.3})`;
          ctx.fill();
        }

        // Se esce dallo schermo in alto, la rigeneriamo sotto
        if (b.y + b.radius < 0) {
          bubbles[i] = createBubble(width, height, true);
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

  return <canvas ref={canvasRef} className="bubbles-canvas"></canvas>;
}
