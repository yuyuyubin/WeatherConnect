import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatDateWithDay } from '../utils/dateUtils';
import deepLearningData from '../utils/deep_learning_data.json';

interface DeepLearningForecastEntry {
  "날짜 시간": string;
  "기온": number;
  "최저기온": number;
  "최고기온": number;
  "풍속": number;
  "강수확률": number;
  "하늘 상태": string;
}

interface DeepLearningForecastProps {
  data: DeepLearningForecastEntry[];
}

export function DeepLearningForecast({ data = deepLearningData as unknown as DeepLearningForecastEntry[] }: DeepLearningForecastProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>딥러닝 모델 날씨 예측</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">현재 딥러닝 모델 데이터를 사용할 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const [selectedDate, setSelectedDate] = useState(data[0]["날짜 시간"]);

  const getWeatherIcon = (condition: string | undefined) => {
    switch (condition?.toLowerCase()) {
      case '맑음':
      case '구름 조금':
        return <Sun className="w-8 h-8" />;
      case '구름 많음':
      case '흐림':
        return <Cloud className="w-8 h-8" />;
      case '비':
        return <CloudRain className="w-8 h-8" />;
      case '눈':
        return <CloudSnow className="w-8 h-8" />;
      default:
        return <Cloud className="w-8 h-8" />;
    }
  };

  const formatDateString = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}-${month}-${day}`;
  };


  const renderDailyForecast = (dayData: DeepLearningForecastEntry) => {
    const formattedDate = formatDateString(dayData["날짜 시간"]);

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{formattedDate} 날씨 예보 (딥러닝 모델)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">기온: {dayData.기온 ?? 'N/A'}</p>
              <p className="font-semibold">최고 기온: {dayData.최고기온 ?? 'N/A'}</p>
              <p className="font-semibold">최저 기온: {dayData.최저기온 ?? 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">풍속: {dayData.풍속 ?? 'N/A'}</p>
              <p className="font-semibold">강수확률: {dayData.강수확률 ?? 'N/A'}</p>
              <p className="font-semibold">하늘 상태: {dayData["하늘 상태"] ?? '정보 없음'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-4xl mt-6">
      <div className="flex overflow-x-auto pb-4 mb-4">
        {data.map((dayData, index) => {
          const formattedDate = formatDateString(dayData["날짜 시간"]);
          return (
            <Button
              key={formattedDate}
              variant={selectedDate === dayData["날짜 시간"] ? "default" : "outline"}
              className={`flex-shrink-0 flex flex-col items-center p-4 h-40 w-32 mx-1 hover:bg-gray-100 transition-colors duration-200 ${selectedDate === dayData["날짜 시간"] ? 'bg-gray-700 hover:bg-gray-800 text-white' : ''}`}
              onClick={() => setSelectedDate(dayData["날짜 시간"])}
            >
              <span className="text-sm font-bold">
                {formatDateWithDay(formattedDate)}
              </span>
              {getWeatherIcon(dayData["하늘 상태"])}
              <div className="text-center mt-2">
                <p className="text-sm font-bold">{dayData.최저기온}/{dayData.최고기온}</p>
              </div>
              <p className="text-xs">{dayData["하늘 상태"] || '정보 없음'}</p>
              <p className="text-xs">강수 {dayData.강수확률}</p>
            </Button>
          );
        })}
      </div>
      {renderDailyForecast(data.find((day) => day["날짜 시간"] === selectedDate)!)}
    </div>
  );
}

