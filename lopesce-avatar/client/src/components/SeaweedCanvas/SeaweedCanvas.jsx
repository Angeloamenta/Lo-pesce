import React, { useEffect, useRef } from 'react';
import './SeaweedCanvas.css';

export default function SeaweedCanvas() {
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

    // Creiamo dei cespugli/grovigli sparsi di alghe invece che uniformi
    const numSeaweeds = 25;
    const seaweeds = [];

    for (let i = 0; i < numSeaweeds; i++) {
      // Clustering: le alghe tendono a concentrarsi in 3-4 punti in basso
      const clusterX = (Math.floor(Math.random() * 4) / 4) * width + (width / 8); 
      // Diffusione attorno al cluster
      const base_x = clusterX + (Math.random() * 200 - 100); 

      // Altezza dell'alga proporzionale all'altezza dello schermo (20% - 50% max)
      const max_h = Math.random() * (height * 0.3) + (height * 0.15); 
      
      seaweeds.push({
        x: base_x,
        height: max_h,
        segments: Math.floor(max_h / 25) + 3, // Segmenti per rendere fluido il movimento
        phase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.0008 + 0.0004, // Variabile in base al tempo
        thickness: Math.random() * 8 + 4, // Spessore alla base
        // Opacità molto lieve sui bordi per fonderli nel fondale azzurro
        baseOpacity: Math.random() * 0.1 + 0.05 
      });
    }

    let animationFrameId;

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < seaweeds.length; i++) {
        const s = seaweeds[i];
        
        let prevX = s.x;
        let prevY = height;
        
        // Disegniamo segmento per segmento per permettere all'alga di assottigliarsi man mano che sale
        for(let j = 1; j <= s.segments; j++) {
            const currentY = height - j * (s.height / s.segments);
            
            // L'oscillazione aumenta man mano che ci si avvicina alla cima (j più alto)
            const wobbleAmount = j * 2.5; 
            
            // Il movimento ondulatorio segue una sinusoide decrescente lungo lo stelo
            const wobbleX = Math.sin(time * s.swaySpeed + s.phase - j * 0.3) * wobbleAmount;
            const currentX = s.x + wobbleX;
            
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            
            // Creiamo un arco morbido invece di una linea dritta
            const cpX = prevX + (currentX - prevX) * 0.5;
            const cpY = prevY + (currentY - prevY) * 0.2;
            ctx.quadraticCurveTo(cpX, cpY, currentX, currentY);
            
            // Calcolo opacità: più è in alto, più si dissolve
            const fadeRatio = 1 - (j / s.segments);
            const currentOpacity = s.baseOpacity * ( fadeRatio + 0.2 );
            
            ctx.strokeStyle = `rgba(180, 240, 255, ${currentOpacity})`;
            // Man mano che sale verso l'alto l'alga diventa sottile
            ctx.lineWidth = Math.max(s.thickness * fadeRatio, 0.5); 
            ctx.lineCap = 'round';
            ctx.stroke();
            
            prevX = currentX;
            prevY = currentY;
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="seaweed-canvas"></canvas>;
}
