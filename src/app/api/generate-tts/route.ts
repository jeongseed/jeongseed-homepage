import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const VOICES: Record<string, string> = {
  ko_female: "Kore",
  ko_male: "Puck",
  ja_female: "Kore",
  en_female: "Zephyr",
  en_male: "Charon",
};

export async function POST(req: NextRequest) {
  const { text, voice = "Kore" } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "텍스트를 입력하세요" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const voiceName = VOICES[voice] || voice;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: text,
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName,
          },
        },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && "inlineData" in part && part.inlineData?.data) {
    const audioBase64 = part.inlineData.data;
    return NextResponse.json({
      audio: `data:audio/wav;base64,${audioBase64}`,
      voice: voiceName,
    });
  }

  return NextResponse.json({ error: "TTS 생성 실패" }, { status: 500 });
}
