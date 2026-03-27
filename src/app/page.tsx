"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

/* ===== INTRO SPLASH ===== */
function IntroSplash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"logo" | "spread" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("spread"), 1400);
    const t2 = setTimeout(() => {
      setPhase("done");
      onDone();
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--black)] transition-opacity duration-700 ${
        phase === "spread" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className={`text-center transition-all duration-700 ${phase === "spread" ? "scale-150 opacity-0" : ""}`}>
        <div
          className="text-5xl md:text-7xl font-[900] tracking-[-0.04em] text-white opacity-0 translate-y-6"
          style={{ animation: "introFadeUp 0.8s 0.2s forwards" }}
        >
          JEONGSEED
        </div>
        <div
          className="text-sm md:text-base text-[var(--gray-500)] mt-3 opacity-0"
          style={{ animation: "introFadeIn 0.6s 0.7s forwards" }}
        >
          솔로프리너를 위한 올인원 AI 도구
        </div>
      </div>
    </div>
  );
}

/* ===== SCROLL FADE-IN ===== */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString();
    }, 20);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
}

function InteractiveVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="py-28 text-center" id="video">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-400)] mb-4">HOW IT WORKS</div>
        <h2 className="text-4xl md:text-5xl font-[800] tracking-[-0.03em] leading-[1.15] text-[var(--black)] mb-4">
          어떻게 작동하는지<br />직접 보세요
        </h2>
        <div
          className="relative max-w-[960px] mx-auto mt-14 rounded-2xl overflow-hidden bg-[var(--gray-900)] aspect-video cursor-pointer shadow-[0_30px_80px_rgba(0,0,0,0.15)]"
          onClick={toggle}
        >
          <video
            ref={videoRef}
            preload="metadata"
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://cdn.coverr.co/videos/coverr-working-on-laptop-at-desk-1584/1080p.mp4" type="video/mp4" />
          </video>
          <button
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all hover:scale-110 ${
              playing ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#000"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      <IntroSplash onDone={handleIntroDone} />

      {/* ===== NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-5 bg-white/0 backdrop-blur-0 transition-all duration-500 hover:bg-white/90 hover:backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-10 flex justify-between items-center">
          <div className="text-xl font-[800] tracking-tight text-[var(--black)]">
            JEONGSEED
            <span className="font-light text-[var(--gray-500)] text-xs ml-2 align-middle">by 제이씨드</span>
          </div>
          <div className="hidden md:flex gap-9 items-center">
            <a href="#about" className="text-sm font-medium text-[var(--gray-600)] hover:text-[var(--black)] transition-colors">소개</a>
            <a href="#services" className="text-sm font-medium text-[var(--gray-600)] hover:text-[var(--black)] transition-colors">서비스</a>
            <a href="#video" className="text-sm font-medium text-[var(--gray-600)] hover:text-[var(--black)] transition-colors">영상</a>
            <Link href="/studio" className="text-sm font-medium text-[var(--gray-600)] hover:text-[var(--black)] transition-colors">AI 스튜디오</Link>
            <a href="#contact" className="bg-[var(--black)] text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:opacity-85 transition-opacity">시작하기</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--gray-50)]">
        <div className="absolute inset-0 overflow-hidden">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-15">
            <source src="https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-5765/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(250,250,250,0.3)] to-[rgba(250,250,250,0.95)]" />
        </div>
        <div className={`relative z-10 max-w-[1280px] mx-auto px-10 pt-36 pb-24 transition-all duration-1000 ${introDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 bg-white border border-[var(--gray-200)] rounded-full px-4 py-2 text-xs font-medium text-[var(--gray-600)] mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI 스튜디오 오픈
          </div>
          <h1 className="text-5xl md:text-7xl font-[900] tracking-[-0.04em] leading-[1.08] text-[var(--black)] mb-6">
            콘텐츠 크리에이터를 위한<br />
            <span className="bg-gradient-to-r from-[var(--gray-700)] to-[var(--gray-400)] bg-clip-text text-transparent">올인원 AI 도구</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--gray-500)] max-w-xl leading-relaxed mb-10">
            주제만 입력하면 대본, 이미지, 영상까지 자동 생성.<br />
            솔로프리너에게 필요한 모든 것을 한 곳에서.
          </p>
          <div className="flex gap-4 mb-16">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 bg-[var(--black)] text-white px-8 py-4 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
            >
              AI 스튜디오 시작
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a
              href="#services"
              className="inline-flex items-center gap-2 border border-[var(--gray-300)] text-[var(--gray-700)] px-8 py-4 rounded-lg font-semibold text-base hover:bg-[var(--gray-100)] transition-colors"
            >
              둘러보기
            </a>
          </div>
          <div className="flex gap-16">
            <div>
              <h3 className="text-3xl font-[800] tracking-tight text-[var(--black)]"><Counter target={2847} suffix="+" /></h3>
              <p className="text-sm text-[var(--gray-500)] mt-1">릴코노미 수강생</p>
            </div>
            <div>
              <h3 className="text-3xl font-[800] tracking-tight text-[var(--black)]"><Counter target={150} suffix="K+" /></h3>
              <p className="text-sm text-[var(--gray-500)] mt-1">생성된 대본</p>
            </div>
            <div>
              <h3 className="text-3xl font-[800] tracking-tight text-[var(--black)]"><Counter target={98} suffix="%" /></h3>
              <p className="text-sm text-[var(--gray-500)] mt-1">만족도</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="py-28" id="about">
        <div className="max-w-[1280px] mx-auto px-10 grid md:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl font-[900] tracking-[-0.04em] text-gray-600">JC</div>
                <div className="text-sm mt-2">JEONGSEED</div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
          <div>
            <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-400)] mb-4">ABOUT</div>
            <h2 className="text-4xl md:text-5xl font-[800] tracking-[-0.03em] leading-[1.15] text-[var(--black)] mb-6">
              혼자서도 전부<br />만들 수 있다는 것을<br />증명합니다
            </h2>
            <p className="text-base text-[var(--gray-500)] leading-relaxed mb-10">
              릴코노미를 통해 2,800명 이상의 크리에이터를 교육하고,
              직접 쓰면서 만든 도구들을 이제 공개합니다.
              AI 티 나지 않는, 진짜 실무에서 쓰는 도구.
            </p>
            <div className="space-y-6">
              {[
                { num: "01", title: "직접 만들고 직접 씁니다", desc: "본인이 매일 사용하는 도구만 서비스로 제공합니다" },
                { num: "02", title: "교육에서 도구까지", desc: "릴코노미에서 배운 것을 바로 실행할 수 있는 환경" },
                { num: "03", title: "원클릭 세팅", desc: "구독 하나로 모든 도구를 바로 사용 가능" },
              ].map((item) => (
                <div key={item.num} className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-lg bg-[var(--gray-100)] flex items-center justify-center text-sm font-bold text-[var(--gray-600)] shrink-0">{item.num}</div>
                  <div>
                    <h4 className="font-semibold text-[var(--black)] mb-1">{item.title}</h4>
                    <p className="text-sm text-[var(--gray-500)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-28 bg-[var(--gray-50)]" id="services">
        <div className="max-w-[1280px] mx-auto px-10">
          <FadeIn className="text-center mb-16">
            <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-400)] mb-4">SERVICES</div>
            <h2 className="text-4xl md:text-5xl font-[800] tracking-[-0.03em] leading-[1.15] text-[var(--black)] mb-4">
              솔로프리너에게 필요한<br />모든 도구, 한 곳에
            </h2>
            <p className="text-base text-[var(--gray-500)]">AI 티 나지 않는, 실무에 바로 쓸 수 있는 도구들</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "001", title: "AI 영상 스튜디오", href: "/studio",
                desc: "주제만 입력하면 대본, 이미지, 음성, 자막까지 자동 생성. 릴스/유튜브 영상을 원클릭으로.",
                tags: ["대본 생성", "이미지 생성", "TTS", "자막"],
                featured: true,
              },
              {
                num: "002", title: "릴스 대본 추출 & 생성",
                desc: "영상 URL만 넣으면 대본이 추출되고, 주제만 입력하면 릴스에 최적화된 대본이 자동 생성됩니다.",
                tags: ["대본 추출", "대본 생성", "훅 분석"],
              },
              {
                num: "003", title: "숏폼 영상 자동화",
                desc: "대본만 있으면 영상을 자동으로 제작합니다. 자막, 화면 전환, BGM까지 원스톱.",
                tags: ["자동 편집", "자막 생성", "BGM"],
              },
              {
                num: "004", title: "카드뉴스 생성",
                desc: "주제만 입력하면 인스타그램에 바로 올릴 수 있는 카드뉴스가 완성됩니다.",
                tags: ["자동 디자인", "인스타 최적화"],
              },
              {
                num: "005", title: "원클릭 AI 세팅",
                desc: "Claude Code, 오픈클로 등 해외 유명 AI 도구를 구독 하나로 자동 설치 & 세팅.",
                tags: ["Claude Code", "자동 설치"],
              },
            ].map((service) => (
              <div
                key={service.num}
                className={`rounded-2xl p-8 transition-transform hover:-translate-y-1 ${
                  service.featured
                    ? "bg-white border-2 border-[var(--black)] md:col-span-2 lg:col-span-1"
                    : "bg-[var(--gray-900)] text-white"
                }`}
              >
                <div className={`text-xs font-mono mb-6 ${service.featured ? "text-[var(--gray-400)]" : "text-[var(--gray-500)]"}`}>{service.num}</div>
                <h3 className="text-xl font-bold mb-3">
                  {service.href ? (
                    <Link href={service.href} className="hover:underline">{service.title}</Link>
                  ) : service.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${service.featured ? "text-[var(--gray-500)]" : "text-[var(--gray-400)]"}`}>
                  {service.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-3 py-1 rounded-full ${
                        service.featured
                          ? "bg-[var(--gray-100)] text-[var(--gray-600)]"
                          : "bg-[var(--gray-800)] text-[var(--gray-400)]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE VIDEO ===== */}
      <InteractiveVideo />

      {/* ===== RESULTS ===== */}
      <section className="py-28 bg-[var(--gray-900)]" id="results">
        <div className="max-w-[1280px] mx-auto px-10 text-center">
          <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-500)] mb-4">RESULTS</div>
          <h2 className="text-4xl md:text-5xl font-[800] tracking-[-0.03em] text-white mb-4">숫자가 증명합니다</h2>
          <p className="text-base text-[var(--gray-500)] mb-16">릴코노미에서 시작된 도구, 실전에서 검증된 성과</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: 2847, suffix: "+", label: "릴코노미 수강생" },
              { num: 150, suffix: "K+", label: "생성된 대본 수" },
              { num: 47, suffix: "+", label: "제공 AI 도구" },
              { num: 98, suffix: "%", label: "만족도" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--gray-800)] rounded-2xl p-8">
                <div className="text-3xl font-[800] text-white mb-2">
                  <Counter target={stat.num} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[var(--gray-500)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 text-center" id="contact">
        <div className="max-w-[1280px] mx-auto px-10">
          <h2 className="text-4xl md:text-5xl font-[800] tracking-[-0.03em] text-[var(--black)] mb-6">지금 시작하세요</h2>
          <p className="text-lg text-[var(--gray-500)] mb-10 max-w-lg mx-auto">
            AI 스튜디오에서 주제 하나로 영상을 만들어보세요.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 bg-[var(--black)] text-white px-10 py-5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            AI 스튜디오 바로가기
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-16 bg-[var(--gray-900)] text-[var(--gray-400)]">
        <div className="max-w-[1280px] mx-auto px-10">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="text-xl font-[800] tracking-tight text-white mb-3">JEONGSEED</div>
              <p className="text-sm leading-relaxed">솔로프리너를 위한 올인원 AI 도구</p>
            </div>
            {/* Links */}
            <div className="flex gap-16">
              <div>
                <div className="text-xs font-semibold tracking-[0.1em] text-[var(--gray-500)] mb-4">메뉴</div>
                <div className="flex flex-col gap-3 text-sm">
                  <a href="#about" className="hover:text-white transition-colors">소개</a>
                  <a href="#services" className="hover:text-white transition-colors">서비스</a>
                  <Link href="/studio" className="hover:text-white transition-colors">AI 스튜디오</Link>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-[0.1em] text-[var(--gray-500)] mb-4">소셜</div>
                <div className="flex flex-col gap-3 text-sm">
                  <a href="https://instagram.com/jseed_money" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                  <a href="https://youtube.com/@jseed_money" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
                </div>
              </div>
            </div>
            {/* Contact */}
            <div>
              <div className="text-xs font-semibold tracking-[0.1em] text-[var(--gray-500)] mb-4">연락처</div>
              <div className="text-sm space-y-2">
                <p>info@trenders.kr</p>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="border-t border-[var(--gray-800)] pt-8">
            <div className="text-xs text-[var(--gray-600)] space-y-1 mb-6">
              <p>(주) 트렌더스 컴퍼니 | 대표 정성우 | 사업자등록번호 424-87-03941</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-xs text-[var(--gray-600)]">
                &copy; 2026 (주) 트렌더스 컴퍼니. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="/privacy" className="text-xs text-[var(--gray-600)] hover:text-[var(--gray-400)] transition-colors">개인정보처리방��</a>
                <a href="/terms" className="text-xs text-[var(--gray-600)] hover:text-[var(--gray-400)] transition-colors">이용약관</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
