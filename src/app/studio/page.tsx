"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

type Scene = {
  scene: number;
  duration: number;
  narration: string;
  visual_desc: string;
  subtitle: string;
  style?: string;
};

type Step = "input" | "script" | "images" | "audio" | "done";

const STYLES = [
  { id: "cinematic", label: "시네마틱", emoji: "🎬" },
  { id: "3d_character", label: "3D 캐릭터", emoji: "🧸" },
  { id: "infographic", label: "인포그래픽", emoji: "📊" },
  { id: "editorial", label: "에디토리얼", emoji: "📸" },
  { id: "minimal", label: "미니멀", emoji: "◻️" },
  { id: "neon", label: "네온", emoji: "💜" },
];

const FORMATS = [
  { id: "reels", label: "릴스 9:16", desc: "인스타/쇼츠/틱톡" },
  { id: "youtube", label: "유튜브 16:9", desc: "유튜브 본편" },
  { id: "square", label: "정사각 1:1", desc: "인스타 피드" },
];

const VOICES = [
  { id: "Kore", label: "여성 (한국어)", flag: "🇰🇷" },
  { id: "Puck", label: "남성 (한국어)", flag: "🇰🇷" },
  { id: "Zephyr", label: "Female (EN)", flag: "🇺🇸" },
  { id: "Charon", label: "Male (EN)", flag: "🇺🇸" },
];

export default function StudioPage() {
  const [step, setStep] = useState<Step>("input");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("reels");
  const [duration, setDuration] = useState(30);
  const [style, setStyle] = useState("cinematic");
  const [voice, setVoice] = useState("Kore");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [images, setImages] = useState<Record<number, string>>({});
  const [audioFiles, setAudioFiles] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const generateScript = useCallback(async () => {
    setLoading(true);
    setProgress("대본 생성 중...");
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, format, duration }),
      });
      const data = await res.json();
      if (data.scenes) {
        setScenes(data.scenes);
        setStep("script");
      } else {
        alert(data.error || "대본 생성 실패");
      }
    } catch (e) {
      alert("대본 생성 오류");
    } finally {
      setLoading(false);
      setProgress("");
    }
  }, [topic, format, duration]);

  const generateImages = useCallback(async () => {
    setLoading(true);
    const newImages: Record<number, string> = {};

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      setProgress(`이미지 생성 중... (${i + 1}/${scenes.length})`);
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: scene.visual_desc,
            format,
            style: scene.style || style,
          }),
        });
        const data = await res.json();
        if (data.image) {
          newImages[scene.scene] = data.image;
          setImages((prev) => ({ ...prev, [scene.scene]: data.image }));
        }
      } catch {
        // skip failed
      }
    }

    setStep("images");
    setLoading(false);
    setProgress("");
  }, [scenes, format, style]);

  const generateAudio = useCallback(async () => {
    setLoading(true);
    const newAudio: Record<number, string> = {};

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (!scene.narration) continue;
      setProgress(`음성 생성 중... (${i + 1}/${scenes.length})`);
      try {
        const res = await fetch("/api/generate-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: scene.narration, voice }),
        });
        const data = await res.json();
        if (data.audio) {
          newAudio[scene.scene] = data.audio;
          setAudioFiles((prev) => ({ ...prev, [scene.scene]: data.audio }));
        }
      } catch {
        // skip
      }
    }

    setStep("audio");
    setLoading(false);
    setProgress("");
  }, [scenes, voice]);

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--gray-200)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-[800] tracking-tight text-[var(--black)]">JEONGSEED</Link>
            <span className="text-[var(--gray-300)]">/</span>
            <span className="text-sm font-semibold text-[var(--gray-600)]">AI Studio</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            {(["input", "script", "images", "audio"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? "bg-[var(--black)] text-white"
                    : scenes.length > 0 && i <= ["input", "script", "images", "audio"].indexOf(step)
                    ? "bg-[var(--gray-300)] text-white"
                    : "bg-[var(--gray-100)] text-[var(--gray-400)]"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ===== STEP 1: INPUT ===== */}
        {step === "input" && (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-[800] tracking-tight text-[var(--black)] mb-2">AI 영상 스튜디오</h1>
            <p className="text-[var(--gray-500)] mb-10">주제만 입력하면 대본, 이미지, 음성까지 자동 생성합니다.</p>

            {/* Topic */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[var(--gray-700)] mb-2">주제</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 릴스 알고리즘 꿀팁 5가지"
                className="w-full px-4 py-3.5 rounded-xl border border-[var(--gray-200)] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[var(--black)] focus:border-transparent placeholder:text-[var(--gray-400)]"
              />
            </div>

            {/* Format */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[var(--gray-700)] mb-3">포맷</label>
              <div className="grid grid-cols-3 gap-3">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      format === f.id
                        ? "border-[var(--black)] bg-white"
                        : "border-[var(--gray-200)] bg-white hover:border-[var(--gray-300)]"
                    }`}
                  >
                    <div className="text-sm font-bold">{f.label}</div>
                    <div className="text-xs text-[var(--gray-500)] mt-1">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[var(--gray-700)] mb-2">
                영상 길이: <span className="text-[var(--gray-500)] font-normal">{duration}초</span>
              </label>
              <input
                type="range"
                min={15}
                max={300}
                step={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-[var(--black)]"
              />
              <div className="flex justify-between text-xs text-[var(--gray-400)] mt-1">
                <span>15초</span>
                <span>5분</span>
              </div>
            </div>

            {/* Style */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-[var(--gray-700)] mb-3">이미지 스타일</label>
              <div className="grid grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      style === s.id
                        ? "border-[var(--black)] bg-white"
                        : "border-[var(--gray-200)] bg-white hover:border-[var(--gray-300)]"
                    }`}
                  >
                    <div className="text-xl mb-1">{s.emoji}</div>
                    <div className="text-xs font-semibold">{s.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-[var(--gray-700)] mb-3">음성</label>
              <div className="grid grid-cols-2 gap-3">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      voice === v.id
                        ? "border-[var(--black)] bg-white"
                        : "border-[var(--gray-200)] bg-white hover:border-[var(--gray-300)]"
                    }`}
                  >
                    <span className="mr-2">{v.flag}</span>
                    <span className="text-sm font-medium">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generateScript}
              disabled={!topic.trim() || loading}
              className="w-full py-4 bg-[var(--black)] text-white rounded-xl font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? progress : "대본 생성하기"}
            </button>
          </div>
        )}

        {/* ===== STEP 2: SCRIPT REVIEW ===== */}
        {step === "script" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-[800] tracking-tight">대본 확인</h2>
                <p className="text-[var(--gray-500)] text-sm mt-1">{scenes.length}개 씬 생성 완료</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("input")}
                  className="px-5 py-2.5 rounded-lg border border-[var(--gray-200)] text-sm font-medium hover:bg-[var(--gray-100)]"
                >
                  다시 생성
                </button>
                <button
                  onClick={generateImages}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-[var(--black)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
                >
                  {loading ? progress : "이미지 생성 →"}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {scenes.map((scene) => (
                <div key={scene.scene} className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-[var(--gray-100)] flex items-center justify-center text-sm font-bold text-[var(--gray-600)]">
                      {scene.scene}
                    </span>
                    <span className="text-xs text-[var(--gray-400)]">{scene.duration}초</span>
                    {scene.style && (
                      <span className="text-xs px-2 py-0.5 bg-[var(--gray-100)] rounded-full text-[var(--gray-500)]">
                        {scene.style}
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-semibold text-[var(--gray-400)] mb-2">나레이션</div>
                      <p className="text-sm leading-relaxed">{scene.narration}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[var(--gray-400)] mb-2">이미지 프롬프트</div>
                      <p className="text-xs leading-relaxed text-[var(--gray-500)]">{scene.visual_desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP 3: IMAGES ===== */}
        {step === "images" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-[800] tracking-tight">이미지 확인</h2>
                <p className="text-[var(--gray-500)] text-sm mt-1">{Object.keys(images).length}개 이미지 생성 완료</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("script")}
                  className="px-5 py-2.5 rounded-lg border border-[var(--gray-200)] text-sm font-medium hover:bg-[var(--gray-100)]"
                >
                  대본으로 돌아가기
                </button>
                <button
                  onClick={generateAudio}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-[var(--black)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
                >
                  {loading ? progress : "음성 생성 →"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {scenes.map((scene) => (
                <div key={scene.scene} className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
                  {images[scene.scene] ? (
                    <img
                      src={images[scene.scene]}
                      alt={`Scene ${scene.scene}`}
                      className="w-full aspect-[9/16] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[9/16] bg-[var(--gray-100)] flex items-center justify-center text-[var(--gray-400)] text-sm">
                      생성 실패
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-xs font-bold text-[var(--gray-600)]">씬 {scene.scene}</div>
                    <p className="text-xs text-[var(--gray-400)] mt-1 line-clamp-2">{scene.subtitle || scene.narration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== STEP 4: AUDIO + DONE ===== */}
        {step === "audio" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-[800] tracking-tight">음성 확인</h2>
                <p className="text-[var(--gray-500)] text-sm mt-1">{Object.keys(audioFiles).length}개 음성 생성 완료</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep("input"); setScenes([]); setImages({}); setAudioFiles({}); }}
                  className="px-5 py-2.5 rounded-lg border border-[var(--gray-200)] text-sm font-medium hover:bg-[var(--gray-100)]"
                >
                  새로 만들기
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {scenes.map((scene) => (
                <div key={scene.scene} className="bg-white rounded-xl border border-[var(--gray-200)] p-6 flex gap-6 items-start">
                  {images[scene.scene] && (
                    <img
                      src={images[scene.scene]}
                      alt={`Scene ${scene.scene}`}
                      className="w-24 h-40 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold">씬 {scene.scene}</span>
                      <span className="text-xs text-[var(--gray-400)]">{scene.duration}초</span>
                    </div>
                    <p className="text-sm text-[var(--gray-600)] mb-3">{scene.narration}</p>
                    {audioFiles[scene.scene] && (
                      <audio controls className="w-full h-10">
                        <source src={audioFiles[scene.scene]} type="audio/wav" />
                      </audio>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 bg-white rounded-xl border border-[var(--gray-200)] p-8 text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-[800] mb-2">소재 생성 완료!</h3>
              <p className="text-[var(--gray-500)] text-sm mb-6">
                대본 {scenes.length}개 + 이미지 {Object.keys(images).length}개 + 음성 {Object.keys(audioFiles).length}개
              </p>
              <p className="text-xs text-[var(--gray-400)]">
                영상 합성(FFmpeg)은 추후 업데이트 예정입니다.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
