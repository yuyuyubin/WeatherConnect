export interface KMAShortTermEntry {
  "날짜 시간": string;
  "기온": string;
  "풍향": string;
  "풍속": string;
  "하늘 상태": string;
  "강수 형태": string;
  "강수확률": string;
  "습도": string;
  "최고기온"?: string;
  "최저기온"?: string;
}

export const kmaShortTermData: KMAShortTermEntry[] = [];

export async function initializeKMAShortTermData() {
  // This function can be used to fetch data dynamically if needed
  // For now, it's not necessary as we're using the static data above
}
