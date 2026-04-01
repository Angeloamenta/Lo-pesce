import React from 'react';
import { useAppStore } from './store/useAppStore';
import { useRealtimeSession } from './hooks/useRealtimeSession';
// import Avatar from './components/Avatar/Avatar';
import Avatar3D from './components/Avatar3D/Avatar3D';
import PushToTalk from './components/PushToTalk/PushToTalk';
import ProductList from './components/ProductList/ProductList';
import LocationList from './components/LocationList/LocationList';
import BubblesCanvas from './components/BubblesCanvas/BubblesCanvas';
import FishesCanvas from './components/FishesCanvas/FishesCanvas';
import SeaweedCanvas from './components/SeaweedCanvas/SeaweedCanvas';
import GodRays from './components/GodRays/GodRays';
import PlanktonCanvas from './components/PlanktonCanvas/PlanktonCanvas';
import './App.css';

function App() {
  const { sessionReady, startListening, stopListening } = useRealtimeSession();
  const { avatarPosition, activeComponent, resetUI } = useAppStore();
  const controlsUnderAvatar = avatarPosition === 'left' && Boolean(activeComponent);

  return (
    <div className="app-container">
      <GodRays />
      <PlanktonCanvas />
      <BubblesCanvas />
      <FishesCanvas />
      <SeaweedCanvas />
      
      {activeComponent && (
        <button className="reset-btn" onClick={resetUI}>
          Torna all'Avatar
        </button>
      )}

      <main className={`main-content layout-${avatarPosition}`}>
        <div className={`avatar-section ${controlsUnderAvatar ? 'with-controls' : ''}`}>
          {/* <Avatar position={avatarPosition} /> */}
          <Avatar3D position={avatarPosition} />
          {controlsUnderAvatar && (
            <div className="avatar-controls">
              <PushToTalk
                startListening={startListening}
                stopListening={stopListening}
                disabled={!sessionReady}
              />
            </div>
          )}
        </div>

        {activeComponent === 'products' && (
          <div className="content-section">
            <ProductList />
          </div>
        )}

        {activeComponent === 'locations' && (
          <div className="content-section">
            <LocationList />
          </div>
        )}

        {activeComponent === 'recipe' && (
          <div className="content-section">
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h2>Ricetta & Cottura</h2>
              <p>Chiedi all'assistente i dettagli della ricetta! Presto nuovi contenuti interattivi in questa sezione.</p>
            </div>
          </div>
        )}
      </main>

      {!controlsUnderAvatar && (
        <footer className="controls-section">
          <PushToTalk
            startListening={startListening}
            stopListening={stopListening}
            disabled={!sessionReady}
          />
        </footer>
      )}
    </div>
  );
}

export default App;
