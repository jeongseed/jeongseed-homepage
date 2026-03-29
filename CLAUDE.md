# 제이씨드 홈페이지(jeongseed.com) — 프로젝트 규칙

> 이 파일은 모든 Claude 에이전트가 **가장 먼저** 읽는 메인 규칙 파일입니다.
> 작업 영역에 따라 아래 세부 규칙 파일을 참고하세요.

---

## 규칙 파일 목록

| 파일 | 영역 | 언제 읽나? |
|------|------|-----------|
| [`.claude/skills/landing-page/SKILL.md`](./.claude/skills/landing-page/SKILL.md) | 메인 랜딩페이지 | 히어로, 섹션, 카피, CTA, 디자인 토큰 수정 시 |
| [`.claude/skills/studio/SKILL.md`](./.claude/skills/studio/SKILL.md) | AI 스튜디오 | 스튜디오 UI, API 라우트, 대본/이미지/TTS 기능 수정 시 |
| [`.claude/architecture.md`](./.claude/architecture.md) | 아키텍처 제약 | 새 페이지/API 추가, 의존성 변경, 금지 패턴 확인 시 |
| [`DEPLOY.md`](./DEPLOY.md) | 배포 가이드 | 배포, 도메인, TODO 체크리스트 확인 시 |

---

## 프로젝트 핵심 정보

- **사이트**: https://jeongseed.com
- **운영자**: 제이씨드 (@jeongseed) / 트렌더스컴퍼니
- **기술**: Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript 5.8
- **AI SDK**: @anthropic-ai/sdk + @google/genai
- **GitHub**: jeongseed/jeongseed-homepage (master)
- **배포**: Vercel (master push → 자동 배포)
- **컨셉**: "솔로프리너를 위한 올인원 AI 도구"

---

## 필수 명령어

```bash
npm run dev          # 로컬 개발 (Turbopack)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npx tsc --noEmit     # 타입 체크 (빌드 없이)
```

---

## 전체 공통 규칙

### 1. 절대 금지
- 코드에 API 키 하드코딩 ❌ → `.env.local`에서만 관리
- `any` 타입 사용 ❌ → `unknown` + 타입 가드 패턴
- 새 색상값 하드코딩 ❌ → `globals.css`의 CSS 변수만 사용
- pages/ 디렉토리 사용 ❌ → App Router만
- 클라이언트에서 AI SDK 직접 호출 ❌ → API 라우트 경유
- console.log 프로덕션 코드에 남기기 ❌

### 2. 디자인 원칙
- 스타일 참조: systemnova.co.kr (AI 티 안나게)
- 컬러: 모노크롬 기반 (--black ~ --gray-50)
- 폰트: Inter + Noto Sans KR (weight 300~900)
- 반응형: `md:` breakpoint 기준

### 3. 작업 흐름 (피드백 루프)
1. 수정 전 `npx tsc --noEmit` 실행
2. 코드 수정
3. 수정 후 `npx tsc --noEmit` 재실행 → 타입 에러 0 확인
4. `npm run build` 성공 확인
5. 커밋

### 4. Git
- 커밋: `type: 한글 요약` + `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- master 직접 커밋 → Vercel 자동 배포
- .env 파일 커밋 금지

---

## 파일 구조

```
src/app/
├── layout.tsx         ← 루트 레이아웃 (메타, 폰트)
├── page.tsx           ← 메인 랜딩페이지
├── globals.css        ← 디자인 토큰 + 전역 스타일
├── studio/page.tsx    ← AI 스튜디오 페이지
└── api/
    ├── generate-script/route.ts  ← Claude 대본 생성
    ├── generate-image/route.ts   ← Google GenAI 이미지
    └── generate-tts/route.ts     ← Google GenAI TTS
```
