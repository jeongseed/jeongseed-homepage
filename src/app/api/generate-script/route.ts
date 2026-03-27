import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `너는 숏폼/유튜브 영상 대본 + AI 이미지 프롬프트 전문가야.
주어진 주제로 씬별 대본을 JSON 배열로 작성해.

규칙:
1. 각 씬은 하나의 명확한 메시지를 전달
2. 나레이션은 자연스럽고 구어체로 (릴스 톤)
3. 첫 씬은 반드시 후킹 (질문 or 충격 사실)
4. 마지막 씬은 CTA (팔로우/구독/저장 유도)

★ visual_desc 작성 규칙:
- 반드시 영어로, 3~5문장의 상세한 이미지 생성 프롬프트
- 구도: close-up / wide shot / bird's eye view / centered composition
- 조명: soft natural light / dramatic side lighting / golden hour / studio lighting
- 분위기: warm cozy / sleek modern / playful vibrant / professional corporate
- 색감: 구체적 색상 팔레트 (muted earth tones, vibrant coral and teal 등)
- 텍스트/숫자가 필요한 씬은 "style": "infographic" 추가
- 사람/캐릭터는 표정, 의상, 포즈까지 묘사

출력: JSON 배열만
[
  {"scene": 1, "duration": 5, "narration": "...", "visual_desc": "...", "subtitle": "...", "style": "cinematic"}
]

style 옵션: cinematic(기본), 3d_character, infographic, editorial, minimal, neon`;

export async function POST(req: NextRequest) {
  const { topic, format = "reels", duration = 30, language = "ko" } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: "주제를 입력하세요" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const numScenes = Math.max(3, Math.floor(duration / 7));
  const formatInfo: Record<string, string> = {
    reels: "인스타 릴스/유튜브 쇼츠 (세로 9:16, 15-60초)",
    youtube: "유튜브 본편 (가로 16:9, 3-10분)",
    square: "인스타 피드 (정사각 1:1, 15-60초)",
  };

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `주제: ${topic}\n포맷: ${formatInfo[format] || format}\n목표 길이: ${duration}초\n씬 수: ${numScenes}개\n언어: ${language}\n\nJSON 배열만 출력.`,
      },
    ],
  });

  let text = response.content[0].type === "text" ? response.content[0].text.trim() : "";

  if (text.includes("```")) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) text = match[1].trim();
  }

  const scenes = JSON.parse(text);
  return NextResponse.json({ scenes });
}
