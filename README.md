# 🍱 메뉴봇 (Lunch Menu Bot)

매일 지정된 시간에 CJ프레시웨이의 점심 메뉴를 조회하여 Microsoft Teams (또는 Azure Logic Apps) Webhook으로 Adaptive Card 형식으로 전송하는 Node.js 기반 봇 프로젝트입니다.

---

## 📦 주요 기능

- CJ프레시웨이 API에서 **오늘의 점심 메뉴** 조회
- Adaptive Card 형식의 JSON payload 생성
- 다수의 Webhook URL로 POST 요청 전송
- `node-cron`을 이용한 **매일 예약 실행** (Asia/Seoul 타임존, 기본 11:00)

---

## 🔧 요구사항

- Node.js v14 이상
- npm 또는 yarn
- 인터넷 연결 (CJ프레시웨이 API 및 Webhook 접근)

---

## 🚀 설치 방법

```bash
# 1. Git 리포지토리 복제
git clone https://github.com/donghyunkim836/rice.git
cd rice

# 2. 의존성 설치
npm install
# 또는
yarn install

# 3. 실행
node index.js
```
