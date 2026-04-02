import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useRealtimeSession } from './hooks/useRealtimeSession';
import Avatar from './components/Avatar/Avatar';
// import Avatar3D from './components/Avatar3D/Avatar3D';
import PushToTalk from './components/PushToTalk/PushToTalk';
import ProductList from './components/ProductList/ProductList';
import RecipeList from './components/RecipeList/RecipeList';
import LocationList from './components/LocationList/LocationList';
import BubblesCanvas from './components/BubblesCanvas/BubblesCanvas';
import FishesCanvas from './components/FishesCanvas/FishesCanvas';
import SeaweedCanvas from './components/SeaweedCanvas/SeaweedCanvas';
import GodRays from './components/GodRays/GodRays';
import PlanktonCanvas from './components/PlanktonCanvas/PlanktonCanvas';
import './App.css';

function App() {
  const { sessionReady, startListening, stopListening } = useRealtimeSession();
  const { avatarPosition, activeComponent, resetUI, transcript } = useAppStore();
  const controlsUnderAvatar = avatarPosition === 'left' && Boolean(activeComponent);

  useEffect(() => {
    const enabled = activeComponent === 'products';
    document.documentElement.classList.toggle('bg-products', enabled);
    document.body.classList.toggle('bg-products', enabled);
    return () => document.body.classList.remove('bg-products');
  }, [activeComponent]);

  return (
    <div className="app-container">
      <GodRays />
      <PlanktonCanvas />
      <BubblesCanvas />
      <FishesCanvas />
      <SeaweedCanvas />
      <div className='logo-container'>
        <img 
          className='logo' 
          src="/favicon-lopesce.png" 
          alt="Lo Pesce Logo" 
          onClick={() => window.location.reload()} 
        />
      </div>
      {activeComponent && (
        <button className="reset-btn" onClick={resetUI}>
          Torna all'Avatar
        </button>
      )}

      <main className={`main-content layout-${avatarPosition}`}>
        <div className={`avatar-section ${controlsUnderAvatar ? 'with-controls' : ''}`}>
          <Avatar
            position={avatarPosition}
            variant={
              activeComponent === 'locations' ? 'saluta' :
                activeComponent ? 'base' :
                  'bolle'
            }
          />
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
            <RecipeList />
          </div>
        )}
      </main>

      {!controlsUnderAvatar && (
        <footer className="controls-section">
          {/* <div className="debug-transcript">
            {transcript
              ? <span>{transcript}</span>
              : <span className="debug-placeholder">La trascrizione apparirà qui…</span>
            }
          </div> */}
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
