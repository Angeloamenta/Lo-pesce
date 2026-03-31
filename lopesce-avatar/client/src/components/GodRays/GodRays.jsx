import React from 'react';
import './GodRays.css';

export default function GodRays() {
  return (
    <div className="god-rays-container">
      <div className="ray ray-1"></div>
      <div className="ray ray-2"></div>
      <div className="ray ray-3"></div>
      <div className="ray ray-4"></div>
      
      {/* Filtro luce ambientale generale */}
      <div className="ambient-caustics"></div>
    </div>
  );
}
