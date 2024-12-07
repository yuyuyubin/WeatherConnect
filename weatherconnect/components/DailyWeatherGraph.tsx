import React from 'react';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProcessedWeatherData } from '../utils/processWeatherData';

interface DailyWeatherGraphProps {
  data: ProcessedWeatherData | undefined;
  selectedIndicators: {
    temperature: boolean;
    precipProbability: boolean;
    windSpeed: boolean;
  };
  setSelectedIndicators: React.Dispatch<React.SetStateAction<{
    temperature: boolean;
    precipProbability: boolean;
    windSpeed: boolean;
  }>>;
}

export function DailyWeatherGraph({ data, selectedIndicators, setSelectedIndicators }: DailyWeatherGraphProps) {
  if (!data) {
    return <div>선택된 날짜의 데이터를 불러올 수 없습니다.</div>;
  }

  const isShortTerm = data.kma.shortTerm && data.kma.shortTerm.length > 0;

  if (isShortTerm) {
    const graphData = data.kma.shortTerm!.map(entry => ({
      time: entry["날짜 시간"]?.split(' ')[1] || '',
      temperature: parseFloat(entry["기온"] || '0'),
      precipProbability: parseInt(entry["강수확률"] || '0'),
      windSpeed: parseFloat((entry["풍속"] || '0').replace('m/s', '').trim())
    }));

    return (
      <Card className="w-full max-w-4xl mt-6 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">{data.date} 시간별 날씨 예보</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="temperature"
              checked={selectedIndicators.temperature}
              onCheckedChange={() => setSelectedIndicators(prev => ({ ...prev, temperature: !prev.temperature }))}
            />
            <Label htmlFor="temperature">기온</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="precipProbability"
              checked={selectedIndicators.precipProbability}
              onCheckedChange={() => setSelectedIndicators(prev => ({ ...prev, precipProbability: !prev.precipProbability }))}
            />
            <Label htmlFor="precipProbability">강수확률</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="windSpeed"
              checked={selectedIndicators.windSpeed}
              onCheckedChange={() => setSelectedIndicators(prev => ({ ...prev, windSpeed: !prev.windSpeed }))}
            />
            <Label htmlFor="windSpeed">풍속</Label>
          </div>
        </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={graphData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
                tick={{ fill: '#666', fontSize: 14 }} 
                axisLine={{ stroke: '#999' }} 
                tickLine={{ stroke: '#999' }}
              />
              <YAxis 
                yAxisId="temp" 
                orientation="left"
                domain={[0, 14]}
                tick={{ fill: '#666', fontSize: 14 }} 
                axisLine={{ stroke: '#999' }} 
                tickLine={{ stroke: '#999' }}
              />
              <YAxis 
                yAxisId="precip" 
                orientation="right" 
                domain={[0, 100]}
                tick={{ fill: '#666', fontSize: 14 }} 
                axisLine={{ stroke: '#999' }} 
                tickLine={{ stroke: '#999' }}
              />
              <YAxis 
                yAxisId="wind" 
                orientation="right" 
                domain={[0, 15]}
                hide={!selectedIndicators.windSpeed}
                tick={{ fill: '#666', fontSize: 14 }}
                axisLine={{ stroke: '#999' }}
                tickLine={{ stroke: '#999' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', border: '1px solid #ddd', fontSize: 12 }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="top" height={40} iconSize={16} wrapperStyle={{ fontSize: 14, paddingBottom: 20 }} />
              {selectedIndicators.temperature && (
                <Area 
                  yAxisId="temp" 
                  type="monotone"
                  dataKey="temperature" 
                  stroke="#ffa366" 
                  strokeWidth={3}
                  fill="#ffa366"
                  fillOpacity={0.3}
                  dot={{ fill: '#ffa366', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 10 }}
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
                  dot={{ fill: '#66b3ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 10 }}
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
                  dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 10 }}
                  name="풍속 (m/s)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 text-gray-700">
            <p className="font-semibold">최고 기온: {Math.max(...graphData.map(entry => entry.temperature || -Infinity)).toFixed(1)}°C</p>
            <p className="font-semibold">최저 기온: {Math.min(...graphData.map(entry => entry.temperature || Infinity)).toFixed(1)}°C</p>
            <p className="font-semibold">평균 습도: {Math.round(graphData.reduce((sum, entry) => sum + (parseFloat(data.kma.shortTerm![graphData.indexOf(entry)]["습도"].replace('%', '')) || 0), 0) / graphData.length)}%</p>
            <p className="font-semibold">평균 풍속: {(graphData.reduce((sum, entry) => sum + (entry.windSpeed || 0), 0) / graphData.length).toFixed(1)}m/s</p>
          </div>
        </CardContent>
      </Card>
    );
  } else if (data.kma.longTerm) {
    return (
      <Card className="w-full max-w-4xl mt-6 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="text-gray-700">
          <p className="font-semibold">최고기온: {data.kma.longTerm["최고기온"]}</p>
          <p className="font-semibold">최저기온: {data.kma.longTerm["최저기온"]}</p>
          <p className="font-semibold">강수확률: {data.kma.longTerm["강수확률"]}</p>
          <p className="font-semibold">하늘상태: {data.kma.longTerm["하늘상태"]}</p>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className="w-full max-w-4xl mt-6 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">{data.date} 날씨 예보</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">해당 날짜의 상세 날씨 정보가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }
}

