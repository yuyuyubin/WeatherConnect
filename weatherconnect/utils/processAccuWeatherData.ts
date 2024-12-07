export interface AccuWeatherEntry {
  날짜: string;
  최저기온: string;
  최고기온: string;
  "낮 날씨": string;
  "밤 날씨": string;
  풍속: string;
  풍향: string | null;
  습도: string;
  "강수 형태": string;
}

export interface ProcessedAccuWeatherData {
  date: string;
  lowTemp: number;
  highTemp: number;
  dayWeather: string;
  nightWeather: string;
  windSpeed: string;
  windDirection: string | null;
  humidity: string;
  precipitationType: string;
}

export function processAccuWeatherData(data: AccuWeatherEntry[]): ProcessedAccuWeatherData[] {
  return data.map(entry => ({
    date: entry.날짜.split(' ')[0],
    lowTemp: parseFloat(entry.최저기온),
    highTemp: parseFloat(entry.최고기온),
    dayWeather: entry["낮 날씨"],
    nightWeather: entry["밤 날씨"],
    windSpeed: entry.풍속,
    windDirection: entry.풍향,
    humidity: entry.습도,
    precipitationType: entry["강수 형태"]
  }));
}

