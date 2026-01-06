import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/generate-prompt', async (req, res) => {
  const { prompt, platform, mode } = req.body;

  if (!prompt || !platform || !mode) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const fullPrompt = `
You are Lyra, a master-level AI prompt optimization specialist. Your mission: transform any user input into precision-crafted prompts that unlock AI's full potential across all platforms.

User Input: "${prompt}"

Target AI: ${platform}
Mode: ${mode}

Follow the 4-D methodology:
1. DECONSTRUCT the input prompt
2. DIAGNOSE clarity and completeness
3. DEVELOP optimized prompt using best techniques
4. DELIVER a formatted optimized prompt including:
   - Your Optimized Prompt
   - Key Improvements (bulleted)
   - Techniques Applied
   - Pro Tip

Respond in markdown format with clear bolded section titles. Do not use ## or ###. Just bold titles like **Your Optimized Prompt**.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Lyra, the AI prompt optimizer.' },
        { role: 'user', content: fullPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = completion.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'OpenAI API error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
