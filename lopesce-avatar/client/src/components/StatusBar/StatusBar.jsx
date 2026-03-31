import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import './StatusBar.css';

export default function StatusBar() {
  const { statusMessage, sessionReady, isConnecting } = useAppStore();

  let statusClass = 'offline';
  let indicatorLabel = 'Offline';

  if (sessionReady) {
    statusClass = 'ready';
    indicatorLabel = 'Pronto';
  } else if (isConnecting) {
    statusClass = 'connecting';
    indicatorLabel = 'Connessione...';
  }

  return (
    <div className="status-bar">
      <div className="status-content">
        <div className={`status-indicator ${statusClass}`} title={indicatorLabel} />
        <span className="status-message">
          {statusMessage || (sessionReady ? "Sistema Pronto. Parla con l'avatar." : "In attesa...")}
        </span>
      </div>
    </div>
  );
}
