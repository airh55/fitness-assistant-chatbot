import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    res.status(200).json({ answer: completion.choices[0].message?.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error with OpenAI request' });
  }
}
