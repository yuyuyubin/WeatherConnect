import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { processKMAData } from '../utils/processKMAData';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'

interface KMAWeatherProps {
  shortTermData: any[];
  longTermData: any[];
  errorRates?: {
    kmaTemp?: number;
    kmaPrecip?: number;
  };
}

export function KMAWeather({ shortTermData, longTermData, errorRates }: KMAWeatherProps) {
  const processedData = processKMAData(shortTermData, longTermData);
  const [selectedDate, setSelectedDate] = useState(processedData[0].date);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case '맑음': return <Sun className="w-6 h-6" />;
      case '구름많음': return <Cloud className="w-6 h-6" />;
      case '흐림': return <Cloud className="w-6 h-6" fill="currentColor" />;
      case '비': return <CloudRain className="w-6 h-6" />;
      case '눈': return <CloudSnow className="w-6 h-6" />;
      default: return <Cloud className="w-6 h-6" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>기상청 날씨 예보 - 군산</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={selectedDate} onValueChange={setSelectedDate}>
          <TabsList className="grid grid-cols-7 mb-4">
            {processedData.map(day => (
              <TabsTrigger key={day.date} value={day.date}>
                {day.date.split('-')[2]}일
              </TabsTrigger>
            ))}
          </TabsList>
          {processedData.map(day => (
            <TabsContent key={day.date} value={day.date}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>일일 개요</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>최고 기온: {day.highTemp}°C</p>
                    <p>최저 기온: {day.lowTemp}°C</p>
                    {day.longTermEntry && (
                      <>
                        <p>강수확률: {day.longTermEntry["강수확률"]}</p>
                        <p>하늘상태: {day.longTermEntry["하늘상태"]}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                {day.shortTermEntries ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>시간별 날씨</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] overflow-y-auto">
                      {day.shortTermEntries.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <span>{entry["날짜 시간"].split(' ')[1]}</span>
                          <span>{entry["기온"]}</span>
                          <span>{getWeatherIcon(entry["하늘 상태"])}</span>
                          <span>{entry["강수확률"]}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>장기 예보</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>강수확률: {day.longTermEntry!["강수확률"]}</p>
                      <p>하늘상태: {day.longTermEntry!["하늘상태"]}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        {errorRates && (
          <div>
            <p>기온 오차: {errorRates.kmaTemp?.toFixed(1)}%</p>
            <p>강수확률 오차: {errorRates.kmaPrecip?.toFixed(1)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

