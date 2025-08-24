// pages/api/chat.ts or app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY,
  baseURL: "https://api.a4f.co/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!messages || !messages.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: model || "provider-6/gemini-2.5-flash-thinking",
      messages,
      temperature: 0.7,
      max_tokens: 200,
    });

    const text = response.choices[0]?.message?.content || "No response";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error getting chat completion:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
