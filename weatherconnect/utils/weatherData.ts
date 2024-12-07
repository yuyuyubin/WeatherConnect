import kmaRawForecastData from './weatherData/kma_Forecast.json';
import openWeatherRawForecastData from './weatherData/open_Forecast.json';
import accuWeatherRawForecastData from './weatherData/Acc_Forecast.json';
import actualRawWeatherData from './weatherData/Weather.json';

export interface RawWeatherData {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipProb: number;
}

export interface WeatherDataSet {
  kor: {
    shortTerm: any[];
    longTerm: any[];
  };
  openWeather: RawWeatherData[];
  accuWeather: RawWeatherData[];
  deepLearning: any[];
  kmaForecast: RawWeatherData[];
  actualWeather: RawWeatherData[];
}

export async function loadWeatherData(): Promise<WeatherDataSet> {
  try {
    // 데이터 변환 함수
    const transformData = (data: any[]): RawWeatherData[] => {
      return data.map(item => ({
        date: item.date,
        avgTemp: item.avgTemp,
        minTemp: item.minTemp,
        maxTemp: item.maxTemp,
        precipProb: item.precipProb,
      }));
    };

    return {
      kor: {
        shortTerm: [],
        longTerm: []
      },
      openWeather: transformData(openWeatherRawForecastData),
      accuWeather: transformData(accuWeatherRawForecastData),
      deepLearning: [],
      kmaForecast: transformData(kmaRawForecastData),
      actualWeather: transformData(actualRawWeatherData)
    };
  } catch (error) {
    console.error('Error in loadWeatherData:', error);
    throw new Error(`날씨 데이터를 불러오는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
  }
}
