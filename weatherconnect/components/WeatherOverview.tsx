import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSnow, Sun } from "lucide-react";
import { ProcessedWeatherData, OpenWeatherEntry, AccuWeatherEntry } from "../utils/processWeatherData";

interface WeatherOverviewProps {
  currentWeather: ProcessedWeatherData | OpenWeatherEntry | AccuWeatherEntry;
  source: "kma" | "openWeather" | "accuWeather";
}

export function WeatherOverview({ currentWeather, source }: WeatherOverviewProps) {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // 요약 표시 여부

  // 날씨 아이콘을 반환하는 함수
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "맑음":
      case "구름 조금":
        return <Sun className="w-24 h-24" />;
      case "구름 많음":
      case "구름 낱개":
      case "흐림":
      case "대체로 흐림":
      case "간헐적 구름":
        return <Cloud className="w-24 h-24" />;
      case "비":
      case "가벼운 비":
      case "소나기":
      case "폭우":
        return <CloudRain className="w-24 h-24" />;
      case "눈":
      case "가벼운 눈":
      case "폭설":
        return <CloudSnow className="w-24 h-24" />;
      default:
        return <Cloud className="w-24 h-24" />;
    }
  };

  // 날씨 조건에 따른 배경 이미지 설정
  const getBackgroundImage = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "맑음":
      case "구름 조금":
        return "/weather-images/sunny.jpg";
      case "구름 많음":
      case "구름 낱개":
      case "흐림":
      case "대체로 흐림":
      case "간헐적 구름":
        return "/weather-images/cloudy.jpg";
      case "비":
      case "가벼운 비":
      case "소나기":
      case "폭우":
        return "/weather-images/rainy.jpg";
      case "눈":
      case "가벼운 눈":
      case "폭설":
        return "/weather-images/snowy.jpg";
      default:
        return "/weather-images/default.jpg";
    }
  };

  // 현재 시간 데이터 가져오기 (기상청 데이터 기준)
  const getCurrentHourData = (data: ProcessedWeatherData) => {
    if (!data || !data.kma || !data.kma.shortTerm) return null;
    const currentHour = new Date().getHours();
    return data.kma.shortTerm.reduce((prev, curr) => {
      const prevHour = parseInt(prev["날짜 시간"].split(" ")[1].slice(0, 2));
      const currHour = parseInt(curr["날짜 시간"].split(" ")[1].slice(0, 2));
      return Math.abs(currHour - currentHour) < Math.abs(prevHour - currentHour) ? curr : prev;
    });
  };

  // 날씨 데이터를 처리하여 반환
  const getWeatherData = () => {
    if (source === "kma") {
      const kmaData = currentWeather as ProcessedWeatherData;
      const currentHourData = getCurrentHourData(kmaData);
      return {
        temperature: currentHourData?.["기온"] || "N/A",
        condition: currentHourData?.["하늘 상태"] || "N/A",
        highTemp: kmaData.kma.highTemp || "N/A",
        lowTemp: kmaData.kma.lowTemp || "N/A",
        precipProbability: currentHourData?.["강수확률"] || "N/A",
        humidity: currentHourData?.["습도"] || "N/A",
        windDirection: currentHourData?.["풍향"] || "N/A",
        windSpeed: currentHourData?.["풍속"] || "N/A",
      };
    } else if (source === "openWeather") {
      const openWeatherData = currentWeather as OpenWeatherEntry;
      return {
        temperature: openWeatherData["기온"] || "N/A",
        condition: openWeatherData["하늘 상태"] || "N/A",
        highTemp: "N/A",
        lowTemp: "N/A",
        precipProbability: openWeatherData["강수 확률"] || "N/A",
        humidity: openWeatherData["습도"] || "N/A",
        windDirection: openWeatherData["풍향"] || "N/A",
        windSpeed: openWeatherData["풍속"] || "N/A",
      };
    } else if (source === "accuWeather") {
      const accuWeatherData = currentWeather as AccuWeatherEntry;
      return {
        temperature: accuWeatherData["최고기온"] || "N/A",
        condition: accuWeatherData["낮 날씨"] || "N/A",
        highTemp: accuWeatherData["최고기온"] || "N/A",
        lowTemp: accuWeatherData["최저기온"] || "N/A",
        precipProbability: "N/A",
        humidity: accuWeatherData["습도"] || "N/A",
        windDirection: accuWeatherData["풍향"] || "N/A",
        windSpeed: accuWeatherData["풍속"] || "N/A",
      };
    }
    return null;
  };

  const weatherData = getWeatherData();
  if (!weatherData) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="flex justify-center items-center p-6">
          <p className="text-xl">날씨 정보를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="w-full max-w-4xl overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer relative"
      onClick={() => setIsSummaryVisible(!isSummaryVisible)} // 클릭 시 요약 토글
      style={{
        backgroundImage: `url(${getBackgroundImage(weatherData.condition)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isSummaryVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity"></div>
      )}
      <CardContent className="relative p-6 text-white">
        {isSummaryVisible ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 text-white transition-opacity duration-300 ease-in-out p-6 h-full w-full">
            <h2 className="text-4xl font-bold mb-4">오늘의 날씨 요약</h2>
            <p className="text-xl text-center">
              오늘은 <span className="font-bold">{weatherData.condition}</span> 날씨입니다.
              최고 기온은 <span className="font-bold">{weatherData.highTemp}</span>, 
              최저 기온은 <span className="font-bold">{weatherData.lowTemp}</span>입니다.
            </p>
            <p className="text-xl text-center mt-2">
              강수 확률은 <span className="font-bold">{weatherData.precipProbability}</span>, 
              습도는 <span className="font-bold">{weatherData.humidity}</span>, 
              바람은 <span className="font-bold">{weatherData.windDirection}</span>에서 
              <span className="font-bold">{weatherData.windSpeed}</span>로 불고 있습니다.
            </p>
            {/* 공백을 추가하여 높이를 늘림 */}
            {}
            {}

            <p className="text-transparent text-lg">{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</p>
            <p className="text-transparent text-lg">{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</p>
            <p className="text-transparent text-lg">{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</p>
            <p className="text-transparent text-lg">{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</p>
            <p className="text-transparent text-lg">{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</p>
            <p className="text-transparent text-lg">{"\n\n\n\n\n\n\n\n\n\n\n\n\n\n"}</p>
            
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-6xl font-bold mb-4">{weatherData.temperature}</h2>
            <div className="mb-4">{getWeatherIcon(weatherData.condition)}</div>
            <p className="text-3xl mb-4">{weatherData.condition}</p>
            <div className="grid grid-cols-2 gap-4 text-xl">
              <div>
                <p>최고: {weatherData.highTemp}</p>
                <p>최저: {weatherData.lowTemp}</p>
                <p>강수확률: {weatherData.precipProbability}</p>
              </div>
              <div>
                <p>습도: {weatherData.humidity}</p>
                <p>풍향: {weatherData.windDirection}</p>
                <p>풍속: {weatherData.windSpeed}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
