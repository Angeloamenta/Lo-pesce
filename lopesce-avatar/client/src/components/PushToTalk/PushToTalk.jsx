import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import './PushToTalk.css';

export default function PushToTalk({ startListening, stopListening, disabled }) {
  const { isListening, isSpeaking, sessionReady } = useAppStore();

  const handlePointerDown = (e) => {
    e.preventDefault(); // previene selezione testo ecc.
    if (!disabled && sessionReady) {
      startListening();
    }
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
  };

  let btnText = "Tieni premuto per parlare";
  let Icon = Mic;

  if (!sessionReady) {
    btnText = "Connessione in corso...";
    Icon = MicOff;
  } else if (isSpeaking) {
    btnText = "Avatar sta parlando...";
    Icon = Volume2;
  } else if (isListening) {
    btnText = "In ascolto...";
    Icon = Mic;
  }

  return (
    <div className="ptt-container">
      <button
        className={`ptt-btn ${isListening ? 'recording' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled}
      >
        <span className="ptt-icon-wrapper">
          <Icon className="ptt-icon" size={32} />
        </span>
      </button>
      <span className="ptt-label">{btnText}</span>
    </div>
  );
}
