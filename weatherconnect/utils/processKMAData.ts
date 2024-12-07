interface KMAShortTermEntry {
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

interface KMALongTermEntry {
  "날짜": string;
  "강수확률"?: string;
  "하늘상태"?: string;
  "최저기온"?: string;
  "최고기온"?: string;
}

interface ProcessedKMAData {
  date: string;
  shortTermEntries?: KMAShortTermEntry[];
  longTermEntry?: KMALongTermEntry;
  highTemp?: number;
  lowTemp?: number;
}

export function processKMAData(shortTermData: KMAShortTermEntry[], longTermData: KMALongTermEntry[]): ProcessedKMAData[] {
  const processedData: { [key: string]: ProcessedKMAData } = {};

  // Process short-term data
  shortTermData.forEach(entry => {
    const date = entry["날짜 시간"].split(' ')[0];
    if (!processedData[date]) {
      processedData[date] = { date, shortTermEntries: [] };
    }
    processedData[date].shortTermEntries!.push(entry);

    if (entry["최고기온"]) {
      processedData[date].highTemp = parseFloat(entry["최고기온"]);
    }
    if (entry["최저기온"]) {
      processedData[date].lowTemp = parseFloat(entry["최저기온"]);
    }
  });

  // Process long-term data
  longTermData.forEach(entry => {
    const date = entry["날짜"];
    if (!processedData[date]) {
      processedData[date] = { date };
    }
    processedData[date].longTermEntry = entry;

    if (entry["최고기온"]) {
      processedData[date].highTemp = parseFloat(entry["최고기온"]);
    }
    if (entry["최저기온"]) {
      processedData[date].lowTemp = parseFloat(entry["최저기온"]);
    }
  });

  return Object.values(processedData);
}

