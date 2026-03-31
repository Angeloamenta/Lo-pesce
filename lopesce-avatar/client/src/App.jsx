import React from 'react';
import { useAppStore } from './store/useAppStore';
import { useRealtimeSession } from './hooks/useRealtimeSession';
import StatusBar from './components/StatusBar/StatusBar';
import Avatar from './components/Avatar/Avatar';
import PushToTalk from './components/PushToTalk/PushToTalk';
import ProductList from './components/ProductList/ProductList';
import LocationList from './components/LocationList/LocationList';
import BubblesCanvas from './components/BubblesCanvas/BubblesCanvas';
import './App.css';

function App() {
  const { sessionReady, startListening, stopListening } = useRealtimeSession();
  const { avatarPosition, activeComponent, resetUI } = useAppStore();

  return (
    <div className="app-container">
      <BubblesCanvas />
      
      <StatusBar />
      
      {activeComponent && (
        <button className="reset-btn" onClick={resetUI}>
          Torna all'Avatar
        </button>
      )}

      <main className={`main-content layout-${avatarPosition}`}>
        <div className="avatar-section">
          <Avatar position={avatarPosition} />
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

      <footer className="controls-section">
        <PushToTalk 
          startListening={startListening} 
          stopListening={stopListening} 
          disabled={!sessionReady}
        />
      </footer>
    </div>
  );
}

export default App;
