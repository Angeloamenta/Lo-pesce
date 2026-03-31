import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, ContactShadows, Float } from '@react-three/drei';
import { useAppStore } from '../../store/useAppStore';
import './Avatar3D.css';

function Model(props) {
  // Carica il modello dalla cartella public
  const { scene } = useGLTF('/avatar-3d.glb');
  
  return <primitive object={scene} {...props} />;
}

export default function Avatar3D({ position }) {
  const { isSpeaking, isListening } = useAppStore();

  return (
    <div className={`avatar3d-wrapper ${position} ${isSpeaking ? 'speaking' : ''} ${isListening ? 'listening' : ''}`}>
      <Canvas
        camera={{ position: [0, 0.8, 4.8], fov: 45 }}
        style={{ width: '100%', height: '100%', zIndex: 2 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          {/* Usiamo Float per replicare l'effetto di galleggiamento dell'avatar 2D */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5} floatingRange={[-0.1, 0.1]}>
            {/* Il group ci permette di inclinare (ruotare sull'asse orizzontale/pitch) l'intero modello interamente all'indietro (verso l'alto) in modo "global" senza conflitto cogli assi del .glb */}
            <group rotation={[-0.15, 0, 0]}>
              <Model position={[-0.1, -0.2, 0]} scale={2.5} rotation={[0, -Math.PI / 2 + 0.2, 0]} />
            </group>
          </Float>
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
        
        {/* ContactShadows rimosso per evitare ombre strane sul fondo */}
      </Canvas>
    </div>
  );
}
