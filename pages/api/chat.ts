import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: "No messages provided" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const answer = completion.choices[0].message?.content;

    res.status(200).json({ answer });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
