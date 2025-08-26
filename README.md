# Exaone 4.0 멀티턴 챗봇 (Next.js + Hugging Face)

한국어 최신 Exaone 4.0 LLM 기반 멀티턴 챗봇입니다.  
Vercel 배포 및 GitHub 관리에 최적화되어 있습니다.

## 주요 특징

- Exaone 4.0 모델 활용 (HuggingFace API)
- 대화 히스토리 기반 멀티턴 챗봇 (로그/DB 저장 없음)
- Next.js 14, React 18 기반, Vercel Edge API Route 지원
- .env.local 환경변수로 API키/모델명 관리
- 간단한 UI 및 대화 초기화 기능

## 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성 후 아래와 같이 입력:

```
HF_API_KEY=your_huggingface_api_key
HF_MODEL_ID=kakao-enterprise/EXAONE-4.0
```

## 개발 서버 실행

```bash
npm install
npm run dev
```

## Vercel 배포 방법

1. GitHub에 전체 소스코드 push
2. [Vercel](https://vercel.com/)에서 레포 import
3. 환경변수(HF_API_KEY, HF_MODEL_ID) 등록
4. 자동 배포

## 참고

- Hugging Face Inference API의 무료/유료 제한에 따라 과금이 발생할 수 있습니다.
- 모델명은 최신 Exaone 4.0으로 유지하세요.