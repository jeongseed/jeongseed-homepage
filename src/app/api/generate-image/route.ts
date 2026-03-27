import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const STYLE_PRESETS: Record<string, string> = {
  cinematic:
    "cinematic lighting, professional color grading, shallow depth of field, 8K ultra HD, photorealistic, film grain, anamorphic lens flare",
  "3d_character":
    "Pixar-style 3D render, subsurface scattering, global illumination, soft studio lighting, vibrant saturated colors, 8K, octane render quality",
  infographic:
    "clean modern infographic design, flat design with subtle gradients, professional data visualization, minimalist layout, bold typography, brand-quality graphic design, vector-sharp edges",
  editorial:
    "high-end editorial photography, magazine cover quality, dramatic lighting, professional retouching, luxury aesthetic",
  minimal:
    "minimalist design, clean white space, Swiss design principles, geometric precision, professional typography, muted color palette",
  neon:
    "cyberpunk neon aesthetic, glowing neon lights, dark background, vibrant cyan and magenta, futuristic UI elements, high contrast",
};

function enhancePrompt(prompt: string, style: string): string {
  const suffix = STYLE_PRESETS[style] || STYLE_PRESETS.cinematic;
  const hasQuality = ["8K", "cinematic", "professional", "photorealistic"].some(
    (kw) => prompt.toLowerCase().includes(kw.toLowerCase())
  );
  return hasQuality ? prompt : `${prompt}. ${suffix}`;
}

const ASPECT_RATIOS: Record<string, string> = {
  reels: "9:16",
  youtube: "16:9",
  square: "1:1",
};

export async function POST(req: NextRequest) {
  const { prompt, format = "reels", style = "cinematic" } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "프롬프트를 입력하세요" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const enhanced = enhancePrompt(prompt, style);
  const aspectRatio = ASPECT_RATIOS[format] || "9:16";

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: enhanced,
    config: {
      numberOfImages: 1,
      aspectRatio,
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const img = response.generatedImages[0];
    const base64 = img.image?.imageBytes
      ? Buffer.from(img.image.imageBytes).toString("base64")
      : "";

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      enhanced_prompt: enhanced,
    });
  }

  return NextResponse.json({ error: "이미지 생성 실패" }, { status: 500 });
}
