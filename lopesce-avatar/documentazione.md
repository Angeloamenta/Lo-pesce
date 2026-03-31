# Documentazione Ufficiale - Avatar "Lo Pesce"

## 1. Panoramica del Progetto
Questo progetto implementa un Avatar Virtuale interattivo per il brand ittico "Lo Pesce". Utilizza la tecnologia **OpenAI Realtime API** (WebRTC) per permettere conversazioni fluide audio-to-audio a bassissima latenza. Mentre l'avatar parla, il browser analizza un intent JSON emesso dall'LLM per mostrare dinamicamente schermate rilevanti (come il catalogo prodotti o le sedi dei negozi).

## 2. Architettura
Il progetto segue una struttura di monorepo diviso in due parti:

*   **`server/` (Express Proxy):** Un server Node.js minimale. Ha un unico scopo: comunicare in sicurezza con le API di OpenAI, passando una chiave segreta e restituendo al client un `ephemeral token` (token a breve durata) necessario per inizializzare WebRTC.
*   **`client/` (React SPA con Vite):** L'applicazione frontend vera e propria. Qui risiede l'hook `useRealtimeSession` che stabilisce il flusso WebRTC. Quando un evento JSON (`response.audio_transcript.done`) viene completato con successo, React estrae l'intento e aggiorna dinamicamente lo store globale (`zustand`), causando la renderizzazione del componente `ProductList` o `LocationList`.

## 3. Prerequisiti
*   **Node.js**: Versione 18.0 o superiore.
*   **Account OpenAI**: Un account attivo con credito, abilitato per il modello GPT-4o-Realtime.
*   **Chiave API OpenAI**: L'API key va generata dalla dashboard (`sk-...`).

## 4. Installazione Passo Passo
Prima di avviare il tool, assicurati che i pacchetti siano installati correttamente:

1.  Scarica o clona interamente il repository.
2.  Assicurati che non vi siano problemi di rete e apri il terminale alla root del progetto `lopesce-avatar/`.
3.  Esegui `npm install` all'interno della cartella radice per installare lo script di orchestazione `concurrently`.
4.  Entra nella cartella `/server`: `cd server && npm install`
5.  Entra nella cartella `/client`: `cd ../client && npm install`
6.  Copia il file `server/.env.example` come `server/.env` e compila `OPENAI_API_KEY=sk-...`
7.  Copia il file `client/.env.example` come `client/.env`.

## 5. Avvio in Locale
Dalla radice del progetto, avvia contemporaneamente frontend e backend usando:
```bash
npm run dev
```

Se preferisci farlo separatamente su due terminali:
*   Terminale 1: `cd server && npm start` (o `npm run dev`)
*   Terminale 2: `cd client && npm run dev`

L'applicazione sarà su `http://localhost:5173`. L'accesso al microfono è necessario nel browser.

## 6. Come usare l'app
1. Apri la pagina nel browser, assicurati che la "Status bar" verde dica "Pronto." in alto.
2. Tieni premuto centralmente il bottone "In Ascolto".
3. Prova a dire: *"Voglio vedere i vostri prodotti surgelati"* e rilascia il pulsante.
4. L'avatar farà il suo pensiero e risponderà a voce. Poco prima che termini l'audio l'interfaccia si sposterà e aprirà il pannello prodotti.
5. Cerca di chiedere: *"Dove avete i punti vendita?"*. Il JSON parser aggiornerà il layout con il menu sedi.

## 7. Personalizzazione Dati
I dati visivi (sedi e prodotti) sono mockati per velocità. 
*   **Prodotti**: Modifica `client/src/data/products.json`.
*   **Sedi**: Modifica `client/src/data/locations.json`.
Le modifiche hanno effetto immediato se avvii il server Vite in modalità `dev`.

## 8. Personalizzazione del System Prompt
Il comportamento linguistico dell'A.I. è guidato interamente da **`client/src/prompts/system-prompt.md`**.
In questo file si richiede rigorosamente di usare JSON e c'è tutto il contesto del brand ("Lo Pesce", brand di pesce surgelato...)
Aggiungendo intent e gestendoli in `useRealtimeSession.js` puoi espandere enormemente l'infrastruttura.

## 9. Come sostituire l'Avatar
Immagine Placeholder: Puoi rimpiazzare l'immagine con sfondo azzurro in `client/public/avatar.png` con una vera (il nome deve restare `avatar.png` se non vuoi modificare il codice in `Avatar.jsx`).

**Per passare a Lottie (Animazioni dinamiche):**
Il file `client/src/components/Avatar/Avatar.jsx` è già commentato e provvisto di template. Installa la lib lottie per react, rimuovi l'attributo `img` e attiva il `<Player />`. Tramite lo stato globale `isSpeaking` potrai controllare l'animazione di avvio labiale.

## 10. Risoluzione problemi comuni
*   **Microfono non trovato**: Permetti al browser di usare il microfono. Controlla il flag nelle impostazioni del sito su Chrome (`chrome://settings/content`).
*   **Connessione... in stato persistente giallo**: Il server proxy sulla porta 3001 potrebbe non essersi avviato. Assicurati che non vi siano problemi loggando internamente il terminale del server Node.
*   **Errore 500 dal Server**: Controlla di aver scritto correttamente la stringa `.env`. Spesso viene passato uno spazio vuoto che la invalida.

## 11. Note di sicurezza
Mai instanziare una connessione OpenAI Realtime WebRTC su un client pubblico senza un Proxy Middleware. Esponendo direttamente la token key nel branch o nel bundle si incorre nel rischio di uso fraudolento della fee, rubando la token list. Per questo l'app usa `server/index.js` che agisce in sicurezza creando gettoni effimeri con TTL (Time To Live) bassissimo adatti allo scopo di una singola chiamata Realtime WebRTC.
