import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import './Avatar.css';

export default function Avatar({ position, variant = 'bolle' }) {
  const { isSpeaking, isListening } = useAppStore();
  const avatarSrc = variant === 'base' ? '/avatar-base.png' : '/avatar-bolle.png';

  /* 
   * PREDISPOSIZIONE LOTTIE 
   * In futuro, invece di un tag <img>, usa:
   * 
   * import { Player } from '@lottiefiles/react-lottie-player';
   * 
   * e poi ritorna:
   * <Player
   *   autoplay
   *   loop={isSpeaking} // O gestisci i frame/segmenti specifici
   *   src="url_or_imported_json"
   *   style={{ height: '300px', width: '300px' }}
   * />
   */

  return (
    <div className={`avatar-wrapper ${position} ${isSpeaking ? 'speaking' : ''} ${isListening ? 'listening' : ''}`}>
      <img src={avatarSrc} alt="Lo Pesce Avatar" className="avatar-image" />
    </div>
  );
}
