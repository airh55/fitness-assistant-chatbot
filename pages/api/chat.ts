import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            `You are a helpful assistant for a fitness studio. Use this info: ` +
            `Opening hours: Mon–Fri 6am–10pm, Sat–Sun 8am–8pm - ` +
            `Membership: $50/month or $500/year - ` +
            `Classes: Yoga at 8am, HIIT at 6pm, Pilates at 7pm daily. ` +
            `Answer clearly and politely.`,
        },
        { role: 'user', content: prompt },
      ],
    });

    res.status(200).json({ text: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI API error' });
  }
}
