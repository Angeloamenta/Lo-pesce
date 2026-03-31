import React, { useEffect, useRef } from 'react';
import './FishesCanvas.css';

export default function FishesCanvas() {
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

    // Pochi pesciolini (8-10) per non esagerare
    const numFishes = 10;
    const fishes = [];

    // Funzione per generare un pesciolino
    function createFish(w, h, startOffscreen = false) {
      const direction = Math.random() > 0.5 ? 1 : -1; // 1 = diretti a destra, -1 = sinistra
      const size = Math.random() * 5 + 2; // Taglie miste ma piccoline

      let x;
      if (startOffscreen) {
        x = direction === 1 ? -size * 5 : w + size * 5;
      } else {
        x = Math.random() * w;
      }
      
      return {
        x: x,
        y: Math.random() * (h * 0.9) + (h * 0.05), // Distribuiti su quasi tutta l'altezza
        size: size,
        speedX: (Math.random() * 0.6 + 0.3) * direction, // Velocità orizzontale
        wobble: Math.random() * Math.PI * 2, 
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        // Molto leggeri e trasparenti per confondersi nello sfondo
        opacity: Math.random() * 0.15 + 0.05, 
        direction: direction
      };
    }

    // Inizializza i pesciolini
    for (let i = 0; i < numFishes; i++) {
        fishes.push(createFish(width, height));
    }

    let animationFrameId;

    const drawFish = (ctx, fish) => {
      ctx.save();
      ctx.translate(fish.x, fish.y);
      if (fish.direction === -1) {
        ctx.scale(-1, 1); // Capovolge il disegno se va a sinistra
      }
      
      const colorOpacity = fish.opacity;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${colorOpacity})`;
      
      // Corpo del pesciolino
      ctx.beginPath();
      ctx.ellipse(0, 0, fish.size * 2, fish.size, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pinna codale (coda triangolare)
      ctx.beginPath();
      ctx.moveTo(-fish.size * 1.5, 0);
      ctx.lineTo(-fish.size * 3, -fish.size * 1.2);
      ctx.lineTo(-fish.size * 3, fish.size * 1.2);
      ctx.fill();
      
      // Pinna superiore
      ctx.beginPath();
      ctx.moveTo(-fish.size * 0.5, -fish.size * 0.8);
      ctx.lineTo(-fish.size * 1.2, -fish.size * 1.8);
      ctx.lineTo(fish.size * 0.5, -fish.size * 0.5);
      ctx.fill();
      
      // Pinna inferiore
      ctx.beginPath();
      ctx.moveTo(-fish.size * 0.5, fish.size * 0.8);
      ctx.lineTo(-fish.size * 1.2, fish.size * 1.8);
      ctx.lineTo(fish.size * 0.5, fish.size * 0.5);
      ctx.fill();

      // Occhialino molto sottile e impercettibile
      ctx.fillStyle = `rgba(0, 50, 100, ${colorOpacity * 1.5})`;
      ctx.beginPath();
      ctx.arc(fish.size, -fish.size * 0.2, fish.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < fishes.length; i++) {
        const f = fishes[i];
        
        // Movimento in avanti
        f.x += f.speedX;
        
        // Tremolio su e giù simulazione nuoto organico
        f.wobble += f.wobbleSpeed;
        const currentY = f.y + Math.sin(f.wobble) * (f.size * 0.4);
        
        drawFish(ctx, { ...f, y: currentY });

        // Quando esce, lo rigeneriamo logicamente dal lato di partenza così il flusso è infinito
        if (f.direction === 1 && f.x - f.size * 4 > width) {
            fishes[i] = createFish(width, height, true);
            fishes[i].direction = 1; 
            fishes[i].x = -fishes[i].size * 5;
            fishes[i].speedX = Math.abs(fishes[i].speedX); // garantisce andata a destra
        } else if (f.direction === -1 && f.x + f.size * 4 < 0) {
            fishes[i] = createFish(width, height, true);
            fishes[i].direction = -1;
            fishes[i].x = width + fishes[i].size * 5;
            fishes[i].speedX = -Math.abs(fishes[i].speedX); // garantisce andata a sinistra
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

  return <canvas ref={canvasRef} className="fishes-canvas"></canvas>;
}
