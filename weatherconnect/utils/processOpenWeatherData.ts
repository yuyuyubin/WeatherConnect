interface OpenWeatherEntry {
  "날짜 시간": string;
  "기온": string;
  "풍향": string;
  "풍속": string;
  "하늘 상태": string;
  "강수 형태": string;
  "강수 확률": string;
  "습도": string;
}

interface ProcessedOpenWeatherData {
  date: string;
  entries: OpenWeatherEntry[];
  highTemp: number;
  lowTemp: number;
}

export function processOpenWeatherData(data: OpenWeatherEntry[]): ProcessedOpenWeatherData[] {
  const processedData: { [key: string]: ProcessedOpenWeatherData } = {};

  data.forEach(entry => {
    const date = entry["날짜 시간"].split(' ')[0];
    if (!processedData[date]) {
      processedData[date] = { 
        date, 
        entries: [], 
        highTemp: -Infinity, 
        lowTemp: Infinity 
      };
    }
    processedData[date].entries.push(entry);

    const temp = parseFloat(entry["기온"].replace('°C', '')); // Parse temperature after removing "°C"
    if (temp > processedData[date].highTemp) processedData[date].highTemp = temp;
    if (temp < processedData[date].lowTemp) processedData[date].lowTemp = temp;
  });

  return Object.values(processedData);
}

