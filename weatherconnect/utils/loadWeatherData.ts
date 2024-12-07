import { kmaShortTermData, kmaLongTermData } from './weatherData/kmaShortTerm';
import { openWeatherData } from './openWeather';
import { accuWeatherData } from './accuWeather';

export async function loadWeatherData() {
  try {
    return {
      kor: { 
        shortTerm: kmaShortTermData || [], 
        longTerm: kmaLongTermData || []
      },
      openWeather: openWeatherData || [],
      accuWeather: accuWeatherData || [],
      deepLearning: [] // Initialize with empty array
    };
  } catch (error) {
    console.error('Error in loadWeatherData:', error);
    throw new Error(`날씨 데이터를 불러오는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
  }
}

