import { KMAShortTermEntry, kmaShortTermData } from './kmaShortTerm';
import { KMALongTermEntry, kmaLongTermData } from './kmaLongTerm';
import { getFormattedDate, addDays } from './dateUtils';

export interface ProcessedWeatherData {
  date: string;
  kma: {
    shortTerm?: KMAShortTermEntry[];
    longTerm?: KMALongTermEntry;
    highTemp?: string;
    lowTemp?: string;
  };
}

export function processWeatherData(): ProcessedWeatherData[] {
  const processedData: { [key: string]: ProcessedWeatherData } = {};

  // 기준 날짜 설정 (현재 날짜 사용)
  const baseDate = new Date();
  const shortTermStartDate = getFormattedDate(baseDate);
  const shortTermEndDate = getFormattedDate(addDays(baseDate, 3)); // 기준 날짜로부터 3일 후까지 단기예보

  // 단기 예보 데이터 처리
  kmaShortTermData.forEach(entry => {
    const [date, time] = entry["날짜 시간"].split(' ');
    const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    
    if (formattedDate >= shortTermStartDate && formattedDate <= shortTermEndDate) {
      if (!processedData[formattedDate]) {
        processedData[formattedDate] = { date: formattedDate, kma: { shortTerm: [] } };
      }
      processedData[formattedDate].kma.shortTerm!.push(entry);

      // 최고 및 최저 기온 업데이트
      const temp = parseFloat(entry["기온"]);
      if (!processedData[formattedDate].kma.highTemp || temp > parseFloat(processedData[formattedDate].kma.highTemp!)) {
        processedData[formattedDate].kma.highTemp = entry["기온"];
      }
      if (!processedData[formattedDate].kma.lowTemp || temp < parseFloat(processedData[formattedDate].kma.lowTemp!)) {
        processedData[formattedDate].kma.lowTemp = entry["기온"];
      }
    }
  });

  // 장기 예보 데이터 처리
  kmaLongTermData.forEach(entry => {
    const date = entry["날짜"];
    if (date > shortTermEndDate) {
      processedData[date] = { 
        date, 
        kma: { 
          longTerm: entry,
          highTemp: entry["최고기온"],
          lowTemp: entry["최저기온"]
        } 
      };
    }
  });

  return Object.values(processedData)
    .sort((a, b) => a.date.localeCompare(b.date));
}

