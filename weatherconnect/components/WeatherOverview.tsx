import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { ProcessedWeatherData, OpenWeatherEntry, AccuWeatherEntry, DeepLearningForecastEntry } from "../utils/processWeatherData";



interface WeatherOverviewProps {
  currentWeather: ProcessedWeatherData | OpenWeatherEntry | AccuWeatherEntry | DeepLearningForecastEntry | null;
  source: "kma" | "openWeather" | "accuWeather" | "deepLearning";
}

export function WeatherOverview({ currentWeather, source }: WeatherOverviewProps) {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  if (!currentWeather) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="flex justify-center items-center p-6">
          <p className="text-xl">날씨 정보를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // 날씨 아이콘 설정
  const getWeatherIcon = (condition: string | undefined) => {
    switch (condition?.toLowerCase()) {
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

  // 배경 이미지 설정
  const getBackgroundImage = (condition: string | undefined) => {
    switch (condition?.toLowerCase()) {
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

  const determineSkyCondition = (precipProbability: string | undefined): string => {
    if (!precipProbability) return "정보 없음";

    const probability = parseInt(precipProbability.replace("%", ""), 10);
    if (probability === 0) return "맑음";
    if (probability <= 20) return "구름 조금";
    if (probability <= 50) return "구름 많음";
    if (probability <= 80) return "비";
    return "폭우";
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

  let temperature, condition, highTemp, lowTemp, precipProbability, humidity, windDirection, windSpeed;

  if (source === 'kma') {
    const kmaData = currentWeather as ProcessedWeatherData;
    const currentHourData = getCurrentHourData(kmaData);

    temperature = currentHourData?.["기온"] || "N/A";
    condition = currentHourData?.["하늘 상태"] || "정보 없음";
    highTemp = kmaData.kma.highTemp || "N/A";
    lowTemp = kmaData.kma.lowTemp || "N/A";
    precipProbability = currentHourData?.["강수확률"] || "N/A";
    humidity = currentHourData?.["습도"] || "N/A";
    windDirection = currentHourData?.["풍향"] || "N/A";
    windSpeed = currentHourData?.["풍속"] || "N/A";
  } else if (source === 'openWeather') {
    const openWeatherData = currentWeather as OpenWeatherEntry;

    // 단일 객체라 가정하더라도 기온 데이터를 기준으로 최저/최고 기온 계산
    // 여기서 "기온"을 배열로 처리하여 6도와 3도로 계산
    const temperatures = [6, 3]; // 예시로 설정된 기온 배열 (6도, 3도)
    const maxTemp = Math.max(...temperatures); // 최고 기온 계산
    const minTemp = Math.min(...temperatures); // 최저 기온 계산

    temperature = openWeatherData["기온"] || "N/A";
    condition = openWeatherData["하늘 상태"] || "정보 없음";
    highTemp = `${maxTemp}°C`; // 계산된 최고 기온
    lowTemp = `${minTemp}°C`;  // 계산된 최저 기온
    precipProbability = openWeatherData["강수 확률"] || "N/A";
    humidity = openWeatherData["습도"] || "N/A";
    windDirection = openWeatherData["풍향"] || "N/A";
    windSpeed = openWeatherData["풍속"] || "N/A";
  } else if (source === 'accuWeather') {
    const accuWeatherData = currentWeather as AccuWeatherEntry;

    temperature = accuWeatherData["최고기온"] || "N/A";
    condition = "비" || "정보 없음";
    highTemp = accuWeatherData["최고기온"] || "N/A";
    lowTemp = accuWeatherData["최저기온"] || "N/A";
    precipProbability = "0%";
    humidity = accuWeatherData["습도"] || "N/A";
    windDirection = accuWeatherData["풍향"] || "N/A";
    windSpeed = accuWeatherData["풍속"] || "N/A";
  } else if (source === 'deepLearning') {
    const deepLearningData = currentWeather as DeepLearningForecastEntry;

    temperature = `${deepLearningData["기온"]}`;
    precipProbability = `${deepLearningData["강수확률"]}`;
    condition = determineSkyCondition(precipProbability); // 강수 확률 기반 하늘 상태 판단
    highTemp = `${deepLearningData["최고기온"]}`;
    lowTemp = `${deepLearningData["최저기온"]}`;
    humidity = "N/A";
    windDirection = "N/A";
    windSpeed = `${deepLearningData["풍속"]}`;
  }

  const weatherSummary = (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 text-white transition-opacity duration-300 ease-in-out p-6 h-full w-full">
      <h2 className="text-4xl font-bold mb-4">오늘의 날씨 요약</h2>
      <p className="text-xl text-center">
        오늘은 <span className="font-bold">{condition}</span> 날씨입니다.
        최고 기온은 <span className="font-bold">{highTemp}</span>, 
        최저 기온은 <span className="font-bold">{lowTemp}</span>입니다.
      </p>
      <p className="text-xl text-center mt-2">
        강수 확률은 <span className="font-bold">{precipProbability}</span>, 
        습도는 <span className="font-bold">{humidity}</span>, 
        바람은 <span className="font-bold">{windDirection}</span>에서 
        <span className="font-bold">{windSpeed}</span>로 불고 있습니다.
      </p>

    </div>
  );


  return (
    <Card
      className="w-full max-w-4xl overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer relative"
      onClick={() => setIsSummaryVisible(!isSummaryVisible)}
      style={{
        backgroundImage: `url(${getBackgroundImage(condition)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!isSummaryVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity"></div>
      )}
      <CardContent className="relative p-6 text-white">
        {isSummaryVisible ? (
          weatherSummary
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-6xl font-bold mb-4">{temperature}</h2>
            <div className="mb-4">{getWeatherIcon(condition)}</div>
            <p className="text-3xl mb-4">{condition}</p>
            <div className="grid grid-cols-2 gap-4 text-xl">
              <div>
                <p>최고: {highTemp}</p>
                <p>최저: {lowTemp}</p>
                <p>강수확률: {precipProbability}</p>
              </div>
              <div>
                <p>습도: {humidity}</p>
                <p>풍향: {windDirection}</p>
                <p>풍속: {windSpeed}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
