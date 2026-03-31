import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/session', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY non configurata nel server' });
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'ash',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore da OpenAI:', errorText);
      return res.status(response.status).json({ error: `Errore OpenAI: ${response.statusText}` });
    }

    const data = await response.json();
    return res.json({ token: data.client_secret.value });
  } catch (error) {
    console.error('Errore creazione sessione Realtime:', error);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server proxy in ascolto sulla porta ${PORT}`);
});
