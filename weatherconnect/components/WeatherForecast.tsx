import React, { useRef, useState } from 'react';
import { ProcessedWeatherData } from '../utils/processWeatherData';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'
import { DailyWeatherGraph } from './DailyWeatherGraph';
import { Button } from "@/components/ui/button"
import { formatDateWithDay } from '../utils/dateUtils';

interface WeatherForecastProps {
  data: ProcessedWeatherData[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function WeatherForecast({ data, selectedDate, onDateSelect }: WeatherForecastProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedIndicators, setSelectedIndicators] = useState({
    temperature: true,
    precipProbability: true,
    windSpeed: true,
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case '맑음':
      case '구름 조금':
        return <Sun className="w-8 h-8" />;
      case '구름 많음':
      case '구름 낱개':
      case '흐림':
        return <Cloud className="w-8 h-8" />;
      case '비':
      case '가벼운 비':
        return <CloudRain className="w-8 h-8" />;
      case '눈':
        return <CloudSnow className="w-8 h-8" />;
      default:
        return <Cloud className="w-8 h-8" />;
    }
  };

  const getDayOfWeek = (dateString: string): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full max-w-4xl mt-6">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 mb-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {data.map((dayData, index) => {
          const formattedDate = dayData.date;
          let temperature, precipProbability, skyCondition;
          const isShortTerm = dayData.kma.shortTerm && dayData.kma.shortTerm.length > 0;

          if (isShortTerm && dayData.kma.shortTerm) {
            const shortData = dayData.kma.shortTerm;
            const relevantEntry = shortData.find(entry => entry["날짜 시간"].endsWith("1500")) ?? 
                                  shortData[shortData.length - 1] ?? 
                                  { "기온": "N/A", "강수확률": "N/A", "하늘 상태": "정보 없음" };
            
            temperature = `${dayData.kma.lowTemp ?? 'N/A'}/${dayData.kma.highTemp ?? 'N/A'}`;
            precipProbability = relevantEntry["강수확률"] ?? 'N/A';
            skyCondition = relevantEntry["하늘 상태"] ?? '정보 없음';
          } else if (dayData.kma.longTerm) {
            const longData = dayData.kma.longTerm;
            temperature = `${longData["최저기온"] || 'N/A'}/${longData["최고기온"] || 'N/A'}`;
            precipProbability = longData["강수확률"]?.split('/')[1]?.trim() || 'N/A';
            skyCondition = longData["하늘상태"]?.split('/')[1]?.trim() || '정보 없음';
          } else {
            temperature = 'N/A';
            precipProbability = 'N/A';
            skyCondition = '정보 없음';
          }

          return (
            <Button
              key={formattedDate}
              variant={selectedDate === formattedDate ? "default" : "outline"}
              className={`flex-shrink-0 flex flex-col items-center p-4 h-40 w-32 mx-1 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105 active:scale-100 transition-transform duration-150 ease-out ${selectedDate === formattedDate ? 'bg-gray-700 hover:bg-gray-800 text-white' : ''}`}
              onClick={() => onDateSelect(formattedDate)}
              style={{ transition: "transform 0.3s ease" }}
            >
              <span className="text-sm font-bold">
                {index === 0 ? '오늘' : formatDateWithDay(formattedDate)}
              </span>
              {getWeatherIcon(skyCondition)}
              <div className="text-center mt-2">
                <p className="text-sm font-bold">{temperature}</p>
              </div>
              <p className="text-xs">{skyCondition}</p>
              <p className="text-xs">강수 {precipProbability}</p>
            </Button>
          );
        })}
      </div>
      <DailyWeatherGraph 
        data={data.find(day => day.date === selectedDate)}
        selectedIndicators={selectedIndicators}
        setSelectedIndicators={setSelectedIndicators}
        className="transform hover:scale-300 active:scale-300 transition-transform duration-150 ease-out"
        style={{ transition: "transform 0.2s ease" }}
      />
    </div>
  );
}