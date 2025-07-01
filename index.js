import cron from "node-cron";
import fetch from "node-fetch";

// 오늘 날짜를 YYYYMMDD 포맷으로
function getTodayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear().toString();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

async function main() {
  const today = getTodayYYYYMMDD();
  const storeIdx = 5978;
  const menuUrl = `https://front.cjfreshmeal.co.kr/meal/v1/today-all-meal?storeIdx=${storeIdx}&mealDt=${today}&reqType=total`;

  let meal;
  try {
    const res = await fetch(menuUrl);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    console.log("메뉴 조회 성공:", data.data);
    const lunchArr = data.data?.["2"];
    if (!Array.isArray(lunchArr) || lunchArr.length === 0) {
      throw new Error("오늘 메뉴 없음");
    }
    meal = lunchArr[0];
  } catch (err) {
    console.error("❌ 메뉴 조회 실패:", err.message);
    return;
  }

  const cardContent = {
    type: "AdaptiveCard",
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
    body: [
      {
        type: "TextBlock",
        text: "🍱 오늘의 점심메뉴",
        weight: "Bolder",
        size: "Large",
      },
      {
        type: "Image",
        url: meal.thumbnailUrl,
        size: "stretch",
        // style: "Person",
      },
      {
        type: "TextBlock",
        text: `**${meal.name}**`,
        wrap: true,
        weight: "Bolder",
        size: "Medium",
      },
      { type: "TextBlock", text: meal.side, wrap: true },
      {
        type: "TextBlock",
        text: `칼로리: ${meal.kcal} kcal`,
        wrap: true,
        spacing: "Small",
      },
    ],
    // actions: [
    //   {
    //     type: "Action.Submit",
    //     title: "맛있을듯? 😋",
    //     data: { feedback: "delicious" },
    //   },
    //   {
    //     type: "Action.Submit",
    //     title: "별로일듯? 😕",
    //     data: { feedback: "bad" },
    //   },
    // ],
  };

  const payload = {
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardContent,
      },
    ],
  };

  const urls = [
    "https://prod-87.southeastasia.logic.azure.com:443/workflows/0254a088b03a4a13a07a5b5e694c5459/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bWTS38bt_TofVbNodL0dRkdVgBZsjRn_0qGAmrKIqLk",
    "https://prod-35.southeastasia.logic.azure.com:443/workflows/a74a954b649645daa171bc6b1466989c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W7YsHV-W29qgbCKalpbIMF4qm8l7Uqynk-9DkwXVdh0",
  ];

  for (const url of urls) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        console.log(`✅ ${url} 전송 성공!`);
      } else {
        const text = await resp.text();
        console.error(`❌ ${url} 전송 실패 [${resp.status}]:`, text);
      }
    } catch (err) {
      console.error(`❌ ${url} 전송 중 오류:`, err.message);
    }
  }
}

console.log(
  `[${new Date().toLocaleString()}] 📡 메뉴봇 시작: 매일 11시에 실행됩니다.`
);

main();

// Cron 스케줄 설정 (매일 오전 11시, 로컬 타임 기준)
// const task = cron.schedule(
//   "30 10 * * *", // 매일 10:30
//   async () => {
//     const now = new Date().toLocaleString();
//     console.log(`[${now}] ⏰ 예약 실행 시작`);
//     try {
//       await main();
//       console.log(`[${now}] ✅ 작업 완료`);
//     } catch (e) {
//       console.error(`[${now}] ❌ 작업 중 오류:`, e);
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Seoul",
//   }
// );

// 프로세스가 종료되지 않도록
process.stdin.resume();
