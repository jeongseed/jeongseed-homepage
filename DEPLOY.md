# jeongseed.com 배포 가이드

## 프로젝트 구조
```
jeongseed-homepage/
├── public/
│   └── index.html    ← 메인 랜딩페이지
├── package.json
├── vercel.json       ← Vercel 설정
└── DEPLOY.md
```

## 로컬에서 배포하기

### 1. GitHub 리포 생성 & 푸시
```bash
cd ~/trenders_company/projects/jeongseed-homepage
gh repo create jeongseed/jeongseed-homepage --public --source=. --push
```

### 2. Vercel 배포
```bash
vercel deploy --prod
```
또는 Vercel 대시보드에서 GitHub 리포 연결

### 3. 커스텀 도메인 연결
Vercel 대시보드 → Settings → Domains → jeongseed.com 추가

## 남은 작업 (TODO)
- [ ] 히어로 배경 영상: Adobe Stock에서 "크리에이터 작업" 영상 교체
- [ ] 데모 섹션 영상: 실제 서비스 데모 녹화 영상 교체
- [ ] About 섹션: 제이씨드 실제 사진 교체
- [ ] CTA 폼: 실제 이메일 수집 연동 (Notion/Supabase 등)
- [ ] 도메인 연결: jeongseed.com → Vercel
- [ ] 새로운 AI 도구/스킬 추가 시 서비스 카드 업데이트

## 디자인 결정사항
- 스타일: systemnova.co.kr 참고 (AI 티 안나게)
- 컨셉: "솔로프리너를 위한 올인원 도구"
- 도메인 전략: jeongseed.com = 올인원 플랫폼 허브
- 브랜드: JEONGSEED by 제이씨드
