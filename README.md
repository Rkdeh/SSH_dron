# DriftCam - Drone Portfolio

드론 포트폴리오 웹사이트입니다. DJI Mini 4 Pro 드론의 기능과 특징을 소개하는 현대적인 원페이지 웹사이트입니다.

## 주요 기능

- 반응형 디자인
- 스크롤 애니메이션
- 이미지 및 비디오 갤러리
- 제품 사양 및 기능 소개
- 인터랙티브 UI 요소

## 기술 스택

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Bebas Neue, Pretendard)

## 배포 방법

### GitHub Pages

1. GitHub에 저장소를 생성합니다
2. 파일을 push합니다:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin [저장소 URL]
git push -u origin main
```
3. GitHub 저장소 Settings > Pages에서 배포 설정

### Netlify

1. Netlify에 로그인합니다
2. "New site from Git" 선택
3. GitHub 저장소 연결
4. 자동 배포 설정 완료

또는 드래그 앤 드롭으로 배포:
1. Netlify에 로그인
2. 프로젝트 폴더를 드래그 앤 드롭

## 로컬 실행

1. 프로젝트를 클론합니다
2. Live Server 또는 로컬 웹 서버로 실행합니다

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

3. 브라우저에서 `http://localhost:8000` 접속

## 폴더 구조

```
drone-portfolio/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 파일
├── iCON/              # 아이콘 파일
│   ├── Mode night.svg
│   └── Storefront.svg
└── assets/            # 미디어 파일 (비디오/이미지는 별도 추가 필요)
    ├── images/
    └── videos/
```

## 주의사항

- HTML 파일에서 로컬 파일 경로를 `assets/` 폴더 구조로 변경했습니다
- 실제 배포 전에 `assets/images/`와 `assets/videos/` 폴더에 필요한 미디어 파일을 추가해야 합니다
- 외부 이미지는 Figma API에서 가져오므로 인터넷 연결이 필요합니다

## 라이선스

Copyright © 2025 DriftCam. All Rights Reserved

## 문의

포트폴리오에 대한 문의사항이 있으시면 연락주세요.
