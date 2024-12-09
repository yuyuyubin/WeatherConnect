import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'
import { OpenWeatherEntry } from '../utils/openWeather';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { formatDateWithDay } from '../utils/dateUtils';

interface OpenWeatherForecastProps {
  data: OpenWeatherEntry[];
  errorRates?: {
    openWeatherTemp?: number;
    openWeatherPrecip?: number;
  };
}

export function OpenWeatherForecast({ data, errorRates }: OpenWeatherForecastProps) {
  if (!data || data.length === 0) {
    return <div>OpenWeather 데이터를 사용할 수 없습니다.</div>;
  }

  const [selectedDate, setSelectedDate] = useState(data[0]?.["날짜 시간"].split(' ')[0] || '');
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
      case '가벼운 눈':
        return <CloudSnow className="w-8 h-8" />;
      default:
        return <Cloud className="w-8 h-8" />;
    }
  };

  
  const formatDate = (dateString: string): string => {
    const [date, time] = dateString.split(' ');
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  const renderDailyForecast = (dayData: OpenWeatherEntry[]) => {
    const graphData = dayData.map(entry => ({
      time: entry["날짜 시간"].split(' ')[1],
      temperature: parseFloat(entry["기온"].replace('°C', '')),
      precipProbability: parseFloat(entry["강수 확률"].replace('%', '')),
      windSpeed: parseFloat(entry["풍속"].replace('m/s', ''))
    }));

    const toggleIndicator = (indicator: keyof typeof selectedIndicators) => {
      setSelectedIndicators(prev => ({ ...prev, [indicator]: !prev[indicator] }));
    };

    return (
      <Card className="w-full mt-4 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{dayData[0]["날짜 시간"].split(' ')[0]} 시간별 날씨 예보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="temperature"
                checked={selectedIndicators.temperature}
                onCheckedChange={() => toggleIndicator('temperature')}
              />
              <Label htmlFor="temperature">기온</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="precipProbability"
                checked={selectedIndicators.precipProbability}
                onCheckedChange={() => toggleIndicator('precipProbability')}
              />
              <Label htmlFor="precipProbability">강수확률</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="windSpeed"
                checked={selectedIndicators.windSpeed}
                onCheckedChange={() => toggleIndicator('windSpeed')}
              />
              <Label htmlFor="windSpeed">풍속</Label>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4299e1" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#4299e1" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#666', fontSize: 12 }} 
                axisLine={{ stroke: '#999' }} 
                tickLine={{ stroke: '#999' }}
              />
              <YAxis 
                yAxisId="temp" 
                orientation="left"
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fill: '#666', fontSize: 12 }} 
                axisLine={{ stroke: '#999' }} 
                tickLine={{ stroke: '#999' }}
              />
              <YAxis 
                yAxisId="precip" 
                orientation="right" 
                domain={[0, 100]}
                tick={{ fill: '#666', fontSize: 12 }} 
                axisLine={{ stroke: '#999' }} 
                tickLine={{ stroke: '#999' }}
              />
              <YAxis yAxisId="wind" orientation="right" domain={[0, 'dataMax + 2']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', border: '1px solid #ddd', fontSize: 12 }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="top" height={36} />
              {selectedIndicators.temperature && (
                <Area 
                  yAxisId="temp" 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ffa366" 
                  strokeWidth={3}
                  fill="#ffa366"
                  fillOpacity={0.3}
                  dot={{ fill: '#ffa366', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  name="기온 (°C)" 
                />
              )}
              {selectedIndicators.precipProbability && (
                <Area 
                  yAxisId="precip" 
                  type="monotone" 
                  dataKey="precipProbability" 
                  stroke="#66b3ff" 
                  strokeWidth={3}
                  fill="#66b3ff"
                  fillOpacity={0.3}
                  dot={{ fill: '#66b3ff', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  name="강수확률 (%)" 
                />
              )}
              {selectedIndicators.windSpeed && (
                <Area 
                  yAxisId="wind" 
                  type="monotone" 
                  dataKey="windSpeed" 
                  stroke="#4CAF50" 
                  strokeWidth={3}
                  fill="#4CAF50"
                  fillOpacity={0.3}
                  dot={{ fill: '#4CAF50', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  name="풍속 (m/s)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 text-gray-700">
            <p className="font-semibold">최고 기온: {Math.max(...dayData.map(entry => parseFloat(entry["기온"].replace('°C', ''))))}°C</p>
            <p className="font-semibold">최저 기온: {Math.min(...dayData.map(entry => parseFloat(entry["기온"].replace('°C', ''))))}°C</p>
            <p className="font-semibold">평균 풍속: {(dayData.reduce((sum, entry) => sum + parseFloat(entry["풍속"].replace('m/s', '')), 0) / dayData.length).toFixed(1)}m/s</p>
            <p className="font-semibold">주 풍향: {dayData[dayData.length - 1]["풍향"]}</p>
            <p className="font-semibold">평균 습도: {Math.round(dayData.reduce((sum, entry) => sum + parseInt(entry["습도"].replace('%', '')), 0) / dayData.length)}%</p>
            <p className="font-semibold">강수 형태: {dayData[dayData.length - 1]["강수 형태"]}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const groupedData = data.reduce((acc, entry) => {
    const date = entry["날짜 시간"].split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, OpenWeatherEntry[]>);

  

  return (
    <div className="w-full max-w-4xl mt-6">
      <div className="flex overflow-x-auto pb-4 mb-4">
        {Object.entries(groupedData).map(([date, entries], index) => {
          const dayData = entries[0];
          
          return (
            <Button
              key={date}
              variant={selectedDate === date ? "default" : "outline"}
              className={`flex-shrink-0 flex flex-col items-center p-4 h-40 w-32 mx-1 hover:bg-gray-100 transition-colors duration-200 ${selectedDate === date ? 'bg-gray-700 hover:bg-gray-800 text-white' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-sm">
                {index === 0 ? '오늘' : formatDateWithDay(formatDate(dayData["날짜 시간"]))}
              </span>
              {getWeatherIcon(dayData["하늘 상태"])}
              <div className="text-center mt-2">
                <p className="text-sm font-bold">
                  {Math.min(...entries.map(e => parseFloat(e["기온"].replace('°C', ''))))}°C/
                  {Math.max(...entries.map(e => parseFloat(e["기온"].replace('°C', ''))))}°C
                </p>
              </div>
              <p className="text-xs">{dayData["하늘 상태"]}</p>
              <p className="text-xs">습도 {dayData["습도"]}</p>
            </Button>
          );
        })}
      </div>
      {renderDailyForecast(groupedData[selectedDate] || Object.values(groupedData)[0])}
      {errorRates && (
        <div>
          <p>기온 오차: {errorRates.openWeatherTemp?.toFixed(1)}%</p>
          <p>강수확률 오차: {errorRates.openWeatherPrecip?.toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}

