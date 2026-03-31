import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import promptText from '../prompts/system-prompt.md?raw';

export function useRealtimeSession() {
  const {
    setListening,
    setSpeaking,
    setConnecting,
    setStatus,
    setSessionReady,
    setAvatarPosition,
    setActiveComponent,
    resetUI,
  } = useAppStore();

  const peerConnection = useRef(null);
  const dataChannel = useRef(null);
  const audioEl = useRef(null);
  const mediaRecorder = useRef(null);
  const localStream = useRef(null);
  const localTrack = useRef(null);

  useEffect(() => {
    // Inizializza l'audio element per riprodurre l'output di GPT
    audioEl.current = new Audio();
    audioEl.current.autoplay = true;

    async function initSession() {
      setConnecting(true);
      setStatus("Connessione in corso...");

      try {
        const URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
        // 1. fetch POST al server per il token
        const tokenResponse = await fetch(`${URL}/api/session`, {
          method: 'POST'
        });

        if (!tokenResponse.ok) {
          throw new Error('Impossibile ottenere il token di sessione');
        }

        const { token } = await tokenResponse.json();

        // 2. Chiedi subito il microfono silenziato (assicura compatibilità SDP perfetta)
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          localStream.current = stream;
          localTrack.current = stream.getAudioTracks()[0];
          localTrack.current.enabled = false; // Muto in partenza
          setStatus("Microfono connesso.");
        } catch (err) {
          console.error("Microfono negato all'avvio:", err);
          setStatus("Accesso al microfono negato.");
          throw err;
        }

        // 3. Crea RTCPeerConnection
        const pc = new RTCPeerConnection();
        peerConnection.current = pc;

        // Aggiungi la traccia prima dell'offerta
        pc.addTrack(localTrack.current, stream);

        // 4. Ricezione audio
        pc.ontrack = (event) => {
          if (audioEl.current && event.track.kind === 'audio') {
            audioEl.current.srcObject = event.streams[0];
            audioEl.current.play().catch(e => console.error("Play prevented", e));
          }
        };

        // 5. Crea DataChannel
        const dc = pc.createDataChannel('oai-events');
        dataChannel.current = dc;

        dc.onopen = async () => {
          setStatus("Connesso.");
          setSessionReady(true);
          setConnecting(false);

          // Carica il prompt importato come raw
          try {
            // Invia istruzioni al modello integrando i Tools!
            dc.send(JSON.stringify({
              type: "session.update",
              session: {
                instructions: promptText,
                input_audio_transcription: { model: "whisper-1" },
                turn_detection: null,
                tools: [
                  {
                    type: "function",
                    name: "change_screen",
                    description: "Cambia la schermata dell'app per mostrare prodotti, sedi o ricette.",
                    parameters: {
                      type: "object",
                      properties: {
                        screen: {
                          type: "string",
                          enum: ["products", "locations", "recipe", "default"]
                        }
                      },
                      required: ["screen"]
                    }
                  }
                ],
                tool_choice: "auto"
              }
            }));
          } catch (e) {
            console.error("Errore caricamento prompt:", e);
          }
        };

        dc.onerror = (error) => {
          console.error("Data channel error:", error);
          setStatus("Errore di connessione.");
        };

        dc.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            console.log("-> OAI Event:", msg.type); // DEBUG UTILITIES
            
            if (msg.type === "response.function_call_arguments.done") {
              // OpenAI ha deciso di chiamare il nostro Tool!
              if (msg.name === "change_screen") {
                try {
                  const args = JSON.parse(msg.arguments);
                  const intent = args.screen;
                  
                  if (intent === "products") {
                    setActiveComponent("products");
                    setAvatarPosition("left");
                  } else if (intent === "locations") {
                    setActiveComponent("locations");
                    setAvatarPosition("left");
                  } else if (intent === "recipe") {
                    setActiveComponent("recipe");
                    setAvatarPosition("left");
                  } else {
                    resetUI();
                  }

                  // FONDAMENTALE: comunichiamo a OpenAI che il tool è andato a buon fine, altrimenti si blocca in "attesa di output" e ripete sempre la stessa frase!
                  if (msg.call_id) {
                    dc.send(JSON.stringify({
                      type: "conversation.item.create",
                      item: {
                        type: "function_call_output",
                        call_id: msg.call_id,
                        output: JSON.stringify({ success: true, message: "Schermata aggiornata correttamente" })
                      }
                    }));
                  }

                } catch (parseError) {
                  console.error("Errore parsando i parametri del tool:", parseError);
                }
              }
            } else if (msg.type === "response.audio.started") {
              setSpeaking(true);
            } else if (msg.type === "response.audio.done") {
              setSpeaking(false);
            } else if (msg.type === "error") {
              console.error("Errore OpenAI Realtime:", msg.error);
              setStatus(`Errore: ${msg.error.message}`);
            }
          } catch (err) {
            console.error("Errore onMessage:", err);
          }
        };

        // 5. Crea offerta SDP e mandala
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const baseUrl = 'https://api.openai.com/v1/realtime';
        const model = 'gpt-4o-realtime-preview-2024-12-17';
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
          method: 'POST',
          body: offer.sdp,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/sdp'
          }
        });

        if (!sdpResponse.ok) {
          const detail = await sdpResponse.text();
          throw new Error('SDP Error: ' + detail);
        }

        const answer = {
          type: 'answer',
          sdp: await sdpResponse.text()
        };
        await pc.setRemoteDescription(answer);

      } catch (err) {
        console.error("ERRORE DETTAGLIATO INIZIALIZZAZIONE:", err);
        setStatus("Errore: " + err.message);
        setConnecting(false);
      }
    }

    initSession();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startListening = async () => {
    if (!localTrack.current) {
      console.warn("Microfono non inizializzato");
      return;
    }
    
    // Abilita la registrazione (RTP manda l'audio fisico al server)
    localTrack.current.enabled = true;
    
    const wasSpeaking = useAppStore.getState().isSpeaking;
    setSpeaking(false);
    
    if (dataChannel.current?.readyState === 'open') {
      // Invia comando di interruzione ESCLUSIVAMENTE se stava già parlando, per evitare l'errore "no active response found"
      if (wasSpeaking) {
        dataChannel.current.send(JSON.stringify({ type: "response.cancel" }));
      }
    }
    setListening(true);
  };

  const stopListening = () => {
    if (localTrack.current) {
      localTrack.current.enabled = false; // Muta la traccia
      setListening(false);
      
      // Costringe OpenAI a rispondere ora che l'utente ha staccato il dito dal pulsante (Walkie Talkie Mode assoluta)
      if (dataChannel.current?.readyState === 'open') {
        dataChannel.current.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
        dataChannel.current.send(JSON.stringify({ type: "response.create" }));
      }
    }
  };

  return { startListening, stopListening, sessionReady: useAppStore.getState().sessionReady };
}
