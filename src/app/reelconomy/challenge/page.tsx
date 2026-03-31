"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ===== Scroll Fade-In ===== */
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

/* ===== 카카오톡 스타일 채팅 버블 ===== */
function KakaoChat({ messages }: { messages: { name: string; text: string; isMe?: boolean }[] }) {
  return (
    <div className="bg-[#B2C7D9] rounded-2xl p-5 space-y-3 max-w-md mx-auto">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.isMe ? "justify-end" : "justify-start"} gap-2`}>
          {!msg.isMe && (
            <div className="w-9 h-9 rounded-xl bg-[var(--gray-300)] shrink-0 flex items-center justify-center text-xs font-bold text-[var(--gray-600)]">
              {msg.name[0]}
            </div>
          )}
          <div>
            {!msg.isMe && <div className="text-xs text-[var(--gray-700)] mb-1 ml-1">{msg.name}</div>}
            <div className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-[280px] ${
              msg.isMe
                ? "bg-[#FEE500] text-[var(--black)]"
                : "bg-white text-[var(--black)]"
            }`}>
              {msg.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== 성과 카드 ===== */
function ResultCard({ stat, label, sub }: { stat: string; label: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center border border-[var(--gray-200)]">
      <div className="text-3xl md:text-4xl font-[800] text-[var(--black)] mb-1">{stat}</div>
      <div className="text-sm font-semibold text-[var(--gray-700)] mb-1">{label}</div>
      <div className="text-xs text-[var(--gray-500)]">{sub}</div>
    </div>
  );
}

export default function ChallengePage() {
  return (
    <>
      {/* ===== NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-white/90 backdrop-blur-xl border-b border-[var(--gray-200)]">
        <div className="max-w-[800px] mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-lg font-[800] tracking-tight text-[var(--black)]">
            JEONGSEED
          </Link>
          <a
            href="#apply"
            className="bg-[var(--black)] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-85 transition-opacity"
          >
            신청하기
          </a>
        </div>
      </nav>

      <main className="pt-16">
        {/* ============================================
            기 (HOOK) — 문제 인식, 공감 유발
        ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--gray-50)]">
          <div className="max-w-[800px] mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 text-xs font-semibold text-red-600 mb-6">
                  4월 6일 START
                </div>
                <h1 className="text-4xl md:text-6xl font-[900] tracking-[-0.04em] leading-[1.1] text-[var(--black)] mb-4">
                  1일 1릴스 강요하는<br />챌린지가 아닙니다
                </h1>
                <p className="text-lg md:text-xl text-[var(--gray-500)] leading-relaxed">
                  릴뿌챌 — 릴스 뿌시기 챌린지
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-8 md:p-10 mb-8">
                <h2 className="text-xl md:text-2xl font-[800] text-[var(--black)] mb-6">
                  여러분이 시작을 못 하는 &apos;진짜 이유&apos;를 아시나요?
                </h2>
                <p className="text-base text-[var(--gray-600)] leading-relaxed mb-6">
                  &quot;내년에도 인스타 시작해야지...&quot; 하고 <strong>생각만</strong> 하실 건가요?<br />
                  우리가 시작을 못 하는 건 시간이 없어서가 아닙니다.<br />
                  <strong>머릿속이 걱정으로 가득 차 있기 때문입니다.</strong>
                </p>
                <div className="space-y-3">
                  {[
                    { emoji: "💭", text: "뭘 찍어야 할지 모르겠어..." },
                    { emoji: "📉", text: "조회수 안 나오면 어쩌지?" },
                    { emoji: "📷", text: "찍어도 이게 맞나?" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 bg-[var(--gray-50)] rounded-xl px-5 py-3">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm text-[var(--gray-700)]">{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-[var(--gray-500)] leading-relaxed">
                  촬영하는 시간보다, <strong className="text-[var(--black)]">걱정하는 시간이 90%</strong>를 차지하고 있지 않나요?
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-[var(--gray-900)] text-white rounded-2xl p-8 md:p-10 text-center">
                <p className="text-lg md:text-xl font-[700] leading-relaxed">
                  혹시 &quot;<span className="text-red-400">나는 센스가 없어서...</span>&quot;라며<br />
                  멈추셨나요?
                </p>
                <p className="text-sm text-[var(--gray-400)] mt-3">단호하게 말씀드릴게요.</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================
            승 (STORY) — 공감 + 사회적 증거
        ============================================ */}
        <section className="py-20 md:py-28">
          <div className="max-w-[800px] mx-auto px-6">
            <FadeIn>
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-[800] tracking-[-0.03em] text-[var(--black)] mb-6">
                  저도 작년 이맘때,<br />똑같이 고민했습니다.
                </h2>
                <div className="text-base text-[var(--gray-600)] leading-relaxed space-y-4">
                  <p>
                    릴스 3개 올리고 포기하고...<br />
                    조회수 50회 보고 자신감 잃고...<br />
                    &quot;아, 나는 안 되나 봐. 소질이 없나 봐.&quot;<br />
                    그렇게 스스로를 의심했습니다.
                  </p>
                  <p className="text-lg font-[700] text-[var(--black)]">
                    하지만 이제는 확실히 알게 되었습니다.
                  </p>
                  <p>
                    여러분이 실패한 건, <strong className="text-red-600">실력이 부족해서가 아닙니다.</strong><br />
                    재능이 없어서는 <strong className="text-red-600">더욱 아닙니다!!</strong>
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 text-center">
                    <p className="text-base font-[700] text-[var(--black)]">
                      그냥 혼자여서 힘들었던 거예요.<br />
                      같이 할 사람만 있었어도 결과는 달랐습니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* 실제 후기 — 카카오톡 스타일 */}
            <FadeIn>
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-[800] text-[var(--black)] mb-2">
                  후기로 보여드릴게요
                </h3>
                <p className="text-sm text-[var(--gray-500)] mb-8">릴스 강의 수강생들의 실제 카카오톡 메시지</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <KakaoChat messages={[
                    { name: "수강생A", text: "릴스 1개로 계약 1건, 미팅 2건 잡혔습니다 😭👏" },
                    { name: "제이씨드", text: "대박!! 축하드려요 🔥 역시 실행하시는 분은 다르네요", isMe: true },
                  ]} />
                  <KakaoChat messages={[
                    { name: "수강생B", text: "팔로워 적은데도 협업 선정되어서 연락받았어요 ㅠㅠ" },
                    { name: "제이씨드", text: "팔로워 숫자가 아니라 콘텐츠 퀄리티가 핵심이에요! 잘하셨어요 👍", isMe: true },
                  ]} />
                  <KakaoChat messages={[
                    { name: "수강생C", text: "방향 잡는 게 고민이었는데 훨씬 확고해졌습니다!" },
                    { name: "수강생C", text: "제 상황에 맞게 컨설팅해주셔서 도움이 많이 되었어요" },
                  ]} />
                  <KakaoChat messages={[
                    { name: "수강생D", text: "오늘 못 올렸어요 😢" },
                    { name: "동기E", text: "내일 같이 올리자!! 나도 힘들었는데 같이 하니까 가능하더라 💪" },
                  ]} />
                </div>
              </div>
            </FadeIn>

            {/* 성과 증명 */}
            <FadeIn>
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-[800] text-[var(--black)] mb-2">
                  실제 변화로 증명합니다
                </h3>
                <p className="text-sm text-[var(--gray-500)] mb-8">단순 조회수가 아닌, 실제 수익화 성과</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <ResultCard stat="10,000" label="1개월 팔로워" sub="0 → 10K 달성" />
                  <ResultCard stat="20만" label="릴스 조회수" sub="영상 1개 성과" />
                  <ResultCard stat="4천만" label="월 순수익" sub="광고비 0원" />
                  <ResultCard stat="100만" label="시술 협찬" sub="영상 10개로 달성" />
                </div>

                <div className="space-y-4">
                  <div className="bg-[var(--gray-50)] rounded-xl p-6 border border-[var(--gray-200)]">
                    <p className="text-sm text-[var(--gray-500)] mb-2">사례 1</p>
                    <p className="text-base font-[600] text-[var(--black)] leading-relaxed">
                      3만 인플루언서 대표님 — 알고리즘 깨진 계정에서<br />
                      영상 1개로 조회수 10만 → 20만, <strong>월 순수익 4천만원</strong> 달성
                    </p>
                  </div>
                  <div className="bg-[var(--gray-50)] rounded-xl p-6 border border-[var(--gray-200)]">
                    <p className="text-sm text-[var(--gray-500)] mb-2">사례 2</p>
                    <p className="text-base font-[600] text-[var(--black)] leading-relaxed">
                      왕초보 제자분 — 피드백 후 영상 2개로<br />
                      <strong>2일 만에 조회수 7만</strong> (팔로워 200명 계정)
                    </p>
                  </div>
                  <div className="bg-[var(--gray-50)] rounded-xl p-6 border border-[var(--gray-200)]">
                    <p className="text-sm text-[var(--gray-500)] mb-2">사례 3</p>
                    <p className="text-base font-[600] text-[var(--black)] leading-relaxed">
                      미용실 창업 영상으로 <strong>월 순수익 2천만원</strong> 추가 수익.<br />
                      광고비 0원. 뷰티 영상 10개로 100만원짜리 시술 협찬.
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-[var(--gray-900)] rounded-xl p-6 text-center">
                  <p className="text-sm text-[var(--gray-400)]">
                    <span className="text-red-400 font-[700]">실력이 갑자기 늘어서가 아닙니다.</span><br />
                    <span className="text-white font-[700]">포기하지 않았기 때문입니다.</span>
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================
            전 (OFFER) — 제안, 혜택 구조
        ============================================ */}
        <section className="py-20 md:py-28 bg-[var(--gray-50)]" id="offer">
          <div className="max-w-[800px] mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-[800] tracking-[-0.03em] text-[var(--black)] mb-4">
                  릴뿌챌린지에서<br />얻어가는 것들
                </h2>
                <p className="text-base text-[var(--gray-500)]">
                  예쁘게 만드는 법만 배우는 수업이 아닙니다.<br />
                  고민할 시간에 실천하게 하는 <strong className="text-[var(--black)]">실전 훈련소</strong>입니다.
                </p>
              </div>
            </FadeIn>

            {/* 모집 요강 */}
            <FadeIn>
              <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-8 md:p-10 mb-8">
                <h3 className="text-lg font-[800] text-[var(--black)] mb-6">모집 요강</h3>
                <div className="space-y-4">
                  {[
                    { label: "기간", value: "4월 6일(일) ~ 5월 3일(토) · 4주간" },
                    { label: "미션", value: "주 2회 콘텐츠 업로드" },
                    { label: "형식", value: "릴스 2회 또는 캐러셀 2회 (자유 선택)" },
                    { label: "인증", value: "업로드 후 단톡방 인증" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 items-start">
                      <span className="text-xs font-bold text-[var(--gray-400)] bg-[var(--gray-100)] rounded-lg px-3 py-1.5 shrink-0 w-16 text-center">{item.label}</span>
                      <span className="text-sm text-[var(--gray-700)] pt-1">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 공통 혜택 */}
            <FadeIn>
              <div className="bg-[var(--black)] text-white rounded-2xl p-8 md:p-10 mb-8">
                <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-500)] mb-6">ALL MEMBERS</div>
                <h3 className="text-xl font-[800] mb-8">전원 공통 혜택</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: "🎓", title: "강의 1회 참가권", desc: "제이씨드가 직접 진행하는 릴코노미 핵심 강의" },
                    { icon: "🎟", title: "릴코노미 할인권", desc: "릴코노미 강의 할인권 증정" },
                    { icon: "✍️", title: "릴스크립트 1개월", desc: "계정 트렌드 분석 · 대본 추출 무제한" },
                    { icon: "🤝", title: "오프라인 모임 1회", desc: "참가비 별도 · 같은 목표를 가진 크루들과 직접 만나요" },
                  ].map((item) => (
                    <div key={item.title}>
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                      <p className="text-xs text-[var(--gray-400)] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 오프라인 모임 섹션 */}
            <FadeIn>
              <div className="bg-gradient-to-br from-[var(--gray-900)] to-[var(--gray-800)] text-white rounded-2xl p-8 md:p-10 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                <div className="relative">
                  <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-500)] mb-4">오프라인에서 만나요</div>
                  <h3 className="text-2xl md:text-3xl font-[800] tracking-[-0.02em] mb-4">
                    제이씨드 크루끼리 모여서<br />인스타 뿌신다!
                  </h3>
                  <p className="text-sm text-[var(--gray-400)] leading-relaxed mb-6 max-w-lg">
                    부동산, 마케팅, 경매, 인스타, 에어비앤비, 전문직, 사업가, 노마드…<br />
                    다양한 분야의 사람들이 모여서 힘든 걸 나누고, 함께 성장하는 모임입니다.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["부동산", "마케팅", "경매", "에어비앤비", "전문직", "사업가", "노마드", "인스타"].map((tag) => (
                      <span key={tag} className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ===== 가격 구조 ===== */}

            {/* 기본 참가비 */}
            <FadeIn>
              <div className="bg-white rounded-2xl border-2 border-[var(--black)] p-8 md:p-10 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs font-mono text-[var(--gray-400)] mb-2">기본 참가비</div>
                    <div className="text-4xl md:text-5xl font-[800] text-[var(--black)]">49,000원</div>
                  </div>
                  <div className="bg-[var(--black)] text-white text-xs font-bold px-4 py-2 rounded-full">BASIC</div>
                </div>
                <div className="flex gap-3 mb-6">
                  <span className="bg-[var(--gray-100)] text-[var(--gray-600)] text-xs font-semibold px-3 py-1.5 rounded-lg">참가비 49,000원</span>
                  <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-lg">+ 보증금 10,000원</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 mb-6">
                  <p className="text-xs text-emerald-700 font-medium">결제 시 59,000원 · 미션 완수 시 보증금 10,000원 환급 (부분취소)</p>
                </div>
                <div className="w-full h-px bg-[var(--gray-200)] mb-6" />
                <p className="text-sm text-[var(--gray-600)] mb-4">릴뿌챌 기본 참가에 포함된 혜택</p>
                <div className="space-y-3">
                  {[
                    "4주간 릴뿌챌 참가권",
                    "OT + 3시간 특강 (제이씨드 직접 진행)",
                    "릴코노미 할인권 증정",
                    "릴스크립트 1개월 (계정 트렌드 분석 · 대본 추출 무제한)",
                    "단톡방 커뮤니티 참여",
                    "동기들과 피드백 품앗이",
                    "오프라인 모임 1회 참가권 (참가비 별도)",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm text-[var(--gray-700)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 추가 옵션 안내 */}
            <FadeIn>
              <div className="text-center mb-6">
                <p className="text-sm font-[700] text-[var(--gray-500)]">더 빠르게 성장하고 싶다면? 추가 옵션을 선택하세요</p>
              </div>
            </FadeIn>

            {/* 추가 옵션 A / B */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <FadeIn>
                <div className="bg-white rounded-2xl p-8 h-full border border-[var(--gray-200)] hover:-translate-y-1 transition-transform">
                  <div className="text-xs font-mono text-[var(--gray-400)] mb-3">추가 옵션 A</div>
                  <div className="text-4xl font-[800] text-[var(--black)] mb-1">+100,000원</div>
                  <div className="text-sm text-[var(--gray-500)] mb-1">1개월 1:1 피드백</div>
                  <div className="text-xs text-[var(--gray-400)] mb-6">기본 59,000원 + 옵션 100,000원 = 총 159,000원</div>
                  <div className="w-full h-px bg-[var(--gray-200)] mb-6" />
                  <div className="space-y-4">
                    {[
                      "기본 참가 혜택 전부 포함",
                      "1개월간 1:1 피드백",
                      "대본 직접 피드백",
                      "편집 피드백",
                      "디자인 피드백",
                      "제이씨드가 직접 피드백해드립니다",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-sm text-[var(--gray-700)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={150}>
                <div className="bg-[var(--black)] text-white rounded-2xl p-8 h-full hover:-translate-y-1 transition-transform relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-white text-[var(--black)] text-xs font-bold px-3 py-1 rounded-full">PREMIUM</div>
                  <div className="text-xs font-mono text-[var(--gray-500)] mb-3">추가 옵션 B</div>
                  <div className="text-4xl font-[800] mb-1">+200,000원</div>
                  <div className="text-sm text-[var(--gray-400)] mb-1">1:1 줌 컨설팅 맞춤설계</div>
                  <div className="text-xs text-[var(--gray-600)] mb-6">기본 59,000원 + 옵션 200,000원 = 총 259,000원</div>
                  <div className="w-full h-px bg-[var(--gray-800)] mb-6" />
                  <div className="space-y-4">
                    {[
                      "기본 참가 혜택 전부 포함",
                      "1:1 줌 컨설팅 (3시간)",
                      "사업자 · 자영업자 · 브랜딩 고민 맞춤 상담",
                      "계정 방향성 · 주제 설계",
                      "1:1 대본 피드백 포함",
                      "제이씨드 직접 1:1 진행",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-sm text-[var(--gray-300)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* 피드백 시스템 */}
            <FadeIn>
              <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-8 mb-8">
                <h3 className="text-lg font-[800] text-[var(--black)] mb-6">피드백 시스템</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h4 className="font-bold text-[var(--black)] text-sm">동료 피드백</h4>
                      <p className="text-xs text-[var(--gray-500)]">릴뿌 동기끼리 서로 대본, 편집, 디자인 피드백</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="font-bold text-[var(--black)] text-sm">댓글/좋아요 품앗이</h4>
                      <p className="text-xs text-[var(--gray-500)]">서로의 콘텐츠에 댓글·좋아요로 함께 성장</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="text-2xl">🧑‍💻</span>
                    <div>
                      <h4 className="font-bold text-[var(--black)] text-sm">제이씨드 랜덤 피드백</h4>
                      <p className="text-xs text-[var(--gray-500)]">주 1회 계정 1개를 랜덤 선정하여 제이씨드가 직접 피드백</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ============================================
            결 (CLOSE) — 긴급성 + CTA
        ============================================ */}
        <section className="py-20 md:py-28" id="apply">
          <div className="max-w-[800px] mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-[800] tracking-[-0.03em] text-[var(--black)] mb-4">
                  이 글에서 나가면<br />다시 혼자입니다.
                </h2>
                <p className="text-base text-[var(--gray-500)] leading-relaxed max-w-lg mx-auto">
                  망설이는 사이, <strong className="text-[var(--black)]">또 1년이 지나갑니다.</strong><br />
                  진짜 실행할 여러분만 함께해주세요.<br />
                  혼자가 아닌 환경에서, 든든한 동료들과 함께 시작하세요.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-[var(--gray-900)] rounded-2xl p-8 md:p-12 text-center">
                <div className="text-xs font-semibold tracking-[0.15em] text-[var(--gray-500)] mb-4">APPLY NOW</div>
                <h3 className="text-2xl md:text-3xl font-[800] text-white mb-3">
                  릴뿌챌 신청하기
                </h3>
                <p className="text-sm text-[var(--gray-400)] mb-2">4월 6일 시작 · 선착순 마감</p>
                <p className="text-xs text-[var(--gray-500)] mb-8">
                  &quot;잘하려고 멈추지 말고, 일단 올리는 사람이 되어 봅시다.&quot;
                </p>

                {/* 요약 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  <div className="bg-[var(--gray-800)] rounded-xl p-4">
                    <div className="text-xs text-[var(--gray-500)] mb-1">기본 참가비</div>
                    <div className="text-sm font-bold text-white">59,000원</div>
                    <div className="text-[10px] text-[var(--gray-600)]">49,000 + 보증금 1만</div>
                  </div>
                  <div className="bg-[var(--gray-800)] rounded-xl p-4">
                    <div className="text-xs text-[var(--gray-500)] mb-1">기간</div>
                    <div className="text-sm font-bold text-white">4주</div>
                  </div>
                  <div className="bg-[var(--gray-800)] rounded-xl p-4">
                    <div className="text-xs text-[var(--gray-500)] mb-1">미션</div>
                    <div className="text-sm font-bold text-white">주 2회</div>
                  </div>
                  <div className="bg-[var(--gray-800)] rounded-xl p-4">
                    <div className="text-xs text-[var(--gray-500)] mb-1">추가 옵션</div>
                    <div className="text-sm font-bold text-white">+10~20만</div>
                  </div>
                </div>

                <a
                  href="https://forms.gle/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[var(--black)] px-10 py-4 rounded-xl font-[800] text-lg hover:bg-[var(--gray-100)] transition-colors"
                >
                  릴뿌챌 신청하기
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>

                <div className="mt-8 space-y-2">
                  <p className="text-xs text-[var(--gray-600)]">
                    ⚠️ 모집은 입금 순 선착순 마감이며, 추가 모집은 없습니다.
                  </p>
                  <p className="text-xs text-[var(--gray-600)]">
                    ⚠️ 피드백 먹튀 방지: 활동 없이 피드백만 받을 시 2회 경고 후 퇴장
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-[var(--gray-900)] text-[var(--gray-400)]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <Link href="/" className="text-lg font-[800] tracking-tight text-white">JEONGSEED</Link>
          <p className="text-xs text-[var(--gray-600)] mt-4">&copy; 2026 (주) 트렌더스 컴퍼니. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
