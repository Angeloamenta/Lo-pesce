# Avatar Interattivo "Lo Pesce"

Un assistente virtuale interattivo per il brand "Lo Pesce", basato su OpenAI Realtime API. L'utente può parlare con un avatar (via microfono) e ricevere risposte vocali in tempo reale, accompagnate da cambi dinamici dell'interfaccia utente (mostrando prodotti, sedi o ricette in base all'argomento).

## 🚀 Quick Start

1. **Configura le chiavi API**
   - Rinomina `server/.env.example` in `server/.env` e inserisci la tua `OPENAI_API_KEY`.
   - Rinomina `client/.env.example` in `client/.env` (l'URL server di default è `http://localhost:3001`).

2. **Installa le dipendenze** e **Avvia l'app**
   Nella cartella radice:
   ```bash
   npm install
   npm run dev
   ```
   Questa operazione installerà tutte le dipendenze in parallelo (se non già fatto in modo granulare) e avvierà sia il client Vite sulla porta 5173 che il server Express sulla 3001.
   
3. **Utilizzo**
   - Apri il browser su `http://localhost:5173`
   - Consenti l'accesso al microfono quando richiesto dopo aver cliccato il pulsante.
   - Tieni premuto il pulsante centrale per parlare.
   - Rilascia per ascoltare la risposta e vedere l'interfaccia aggiornarsi se chiedi di prodotti, sedi o ricette!

Per maggiori dettagli sull'architettura, personalizzazione dati e uso, consulta il file `documentazione.md`.
