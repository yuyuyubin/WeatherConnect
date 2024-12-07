import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface DeepLearningForecastProps {
  data: any[]; // Replace 'any' with the actual type of your deep learning forecast data
}

export function DeepLearningForecast({ data }: DeepLearningForecastProps) {
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

  const [selectedDate, setSelectedDate] = useState(data[0]?.date || '');

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
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

  const getDayOfWeek = (dateString: string): string => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const renderDailyForecast = (dayData: any) => {
    const graphData = dayData.hourlyData.map((entry: any) => ({
      time: entry.time,
      temperature: entry.temperature,
      precipProbability: entry.precipProbability
    }));

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{dayData.date} 날씨 예보 (딥러닝 모델)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis yAxisId="temp" orientation="left" domain={['dataMin - 5', 'dataMax + 5']} />
              <YAxis yAxisId="precip" orientation="right" domain={[0, 100]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area yAxisId="temp" type="monotone" dataKey="temperature" stroke="#ff7300" fillOpacity={1} fill="url(#colorTemp)" name="기온 (°C)" />
              <Area yAxisId="precip" type="monotone" dataKey="precipProbability" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPrecip)" name="강수확률 (%)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">최고 기온: {dayData.highTemp}°C</p>
              <p className="font-semibold">최저 기온: {dayData.lowTemp}°C</p>
            </div>
            <div>
              <p className="font-semibold">평균 습도: {dayData.avgHumidity}%</p>
              <p className="font-semibold">평균 풍속: {dayData.avgWindSpeed}m/s</p>
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
          const formattedDate = dayData.date;
          
          return (
            <Button
              key={formattedDate}
              variant={selectedDate === formattedDate ? "default" : "outline"}
              className={`flex-shrink-0 flex flex-col items-center p-4 h-40 w-32 mx-1 hover:bg-gray-100 transition-colors duration-200 ${selectedDate === formattedDate ? 'bg-gray-700 hover:bg-gray-800 text-white' : ''}`}
              onClick={() => setSelectedDate(formattedDate)}
            >
              <span className="text-sm font-bold">
                {index === 0 ? '오늘' : getDayOfWeek(formattedDate)}
              </span>
              <span className="text-xs">{formattedDate.slice(-5)}</span>
              {getWeatherIcon(dayData.weatherCondition)}
              <div className="text-center mt-2">
                <p className="text-sm font-bold">{dayData.lowTemp}/{dayData.highTemp}°C</p>
              </div>
              <p className="text-xs">{dayData.weatherCondition}</p>
              <p className="text-xs">강수 {dayData.precipProbability}%</p>
            </Button>
          );
        })}
      </div>
      {renderDailyForecast(data.find(day => day.date === selectedDate))}
    </div>
  );
}

