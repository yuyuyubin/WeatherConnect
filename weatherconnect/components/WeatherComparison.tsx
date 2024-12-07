import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tabel"
import { ProcessedWeatherData } from '../utils/processWeatherData';
import { OpenWeatherEntry } from '../utils/openWeather';
import { AccuWeatherEntry } from '../utils/accuWeather';
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, isSameDay } from 'date-fns';
import { DialogDescription } from "@/components/ui/dialog";
import { DeepLearningForecastEntry } from './DeepLearningForecast'; // Import DeepLearningForecastEntry

interface WeatherComparisonProps {
  kmaData: ProcessedWeatherData[];
  openWeatherData: OpenWeatherEntry[];
  accuWeatherData: AccuWeatherEntry[];
  deepLearningData: DeepLearningForecastEntry[];
}

export function WeatherComparison({ kmaData, openWeatherData, accuWeatherData, deepLearningData }: WeatherComparisonProps) {
  const formatDateString = (dateString: string) => {
    const [date, time] = dateString.split(' ');
    return date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  };

  // 데이터 전처리
  const processedOpenWeatherData = openWeatherData.reduce((acc, entry) => {
    const date = formatDateString(entry["날짜 시간"]).split(' ')[0];
    if (!acc[date]) {
      acc[date] = { 최저기온: Infinity, 최고기온: -Infinity, entries: [] };
    }
    const temp = parseFloat(entry["기온"].replace("°C", "")); // Remove "°C" before parsing
    acc[date].최저기온 = Math.min(acc[date].최저기온, temp);
    acc[date].최고기온 = Math.max(acc[date].최고기온, temp);
    acc[date].entries.push(entry);
    return acc;
  }, {} as Record<string, { 최저기온: number; 최고기온: number; entries: OpenWeatherEntry[] }>);

  const processedAccuWeatherData = accuWeatherData.map(entry => ({
    ...entry,
    날짜: `${formatDateString(entry.날짜)} ${entry.날짜.split(' ')[1]}`
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);  // 오늘 날짜의 시작으로 설정
  const endDate = addDays(today, 5); // 오늘부터 5일 후까지 표시

  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');
  const [selectedDate, setSelectedDate] = useState(() => {
    const filteredData = kmaData.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= today && dayDate <= endDate;
    });
    return filteredData.length > 0 ? filteredData[0].date : format(today, 'yyyy-MM-dd');
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const getWeatherIcon = (condition: string | undefined) => {
    switch (condition?.toLowerCase()) {
      case '맑음':
      case '구름 조금':
        return <Sun className="w-6 h-6" />;
      case '구름 많음':
      case '흐림':
        return <Cloud className="w-6 h-6" />;
      case '비':
      case '가벼운 비':
        return <CloudRain className="w-6 h-6" />;
      case '눈':
        return <CloudSnow className="w-6 h-6" />;
      default:
        return <CloudDrizzle className="w-6 h-6" />;
    }
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    const weekDay = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    return {
      month,
      day,
      weekDay: weekDays[weekDay]
    };
  };

  const renderDailyWeatherData = (provider: string, day: ProcessedWeatherData) => {
    let data;
    switch (provider) {
      case '기상청':
        data = day.kma;
        return (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data.shortTerm?.[4]?.["하늘 상태"] || data.longTerm?.["하늘상태"]?.split('/')[0] || '맑음')}
              {getWeatherIcon(data.shortTerm?.[8]?.["하늘 상태"] || data.longTerm?.["하늘상태"]?.split('/')[1] || '맑음')}
            </div>
            <div className="text-sm">{data.lowTemp || '-'}° / {data.highTemp || '-'}°</div>
            <div className="text-xs text-blue-500">
              {data.shortTerm?.[4]?.["강수확률"] || data.longTerm?.["강수확률"]?.split('/')[0] || '0%'}
            </div>
          </div>
        );
      case '아큐웨더':
        data = processedAccuWeatherData.find(entry => entry.날짜.split(' ')[0] === day.date);
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data["낮 날씨"] || '맑음')}
              {getWeatherIcon(data["밤 날씨"] || '맑음')}
            </div>
            <div className="text-sm">{data.최저기온 || '-'}° / {data.최고기온 || '-'}°</div>
            <div className="text-xs text-blue-500">
              {data["강수 형태"] === "없음" ? "0%" : "100%"}
            </div>
          </div>
        ) : null;
      case '오픈웨더':
        data = processedOpenWeatherData[day.date];
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data.entries[0]["하늘 상태"] || '맑음')}
            </div>
            <div className="text-sm">{data.최저기온.toFixed(1)}° / {data.최고기온.toFixed(1)}°</div>
            <div className="text-xs text-blue-500">
              {data.entries[0]["강수 확률"] || '0%'}
            </div>
          </div>
        ) : null;
      case '딥러닝모델':
        data = deepLearningData.find(entry => formatDateString(entry["날짜 시간"]) === day.date);
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data["하늘 상태"])}
            </div>
            <div className="text-sm">{data.최저기온 || '-'}° / {data.최고기온 || '-'}°</div>
            <div className="text-xs text-blue-500">
              {data.강수확률 || '0%'}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const renderHourlyWeatherData = (provider: string, hour: string) => {
    let data;
    switch (provider) {
      case '기상청':
        data = kmaData.find(day => day.date === selectedDate)?.kma.shortTerm?.find(entry => entry["날짜 시간"].split(' ')[1].slice(0, 2) === hour.slice(0, 2));
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data["하늘 상태"] || '맑음')}
            </div>
            <div className="text-sm">{data["기온"] || '-'}°</div>
            <div className="text-xs text-blue-500">
              {data["강수확률"] || '0%'}
            </div>
          </div>
        ) : null;
      case '아큐웨더':
        data = processedAccuWeatherData.find(entry => entry.날짜.startsWith(selectedDate) && entry.날짜.split(' ')[1].slice(0, 2) === hour.slice(0, 2));
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(hour >= '0600' && hour <= '1800' ? data["낮 날씨"] : data["밤 날씨"] || '맑음')}
            </div>
            <div className="text-sm">{data.최저기온 || '-'}° / {data.최고기온 || '-'}°</div>
            <div className="text-xs text-blue-500">
              {data["강수 형태"] === "없음" ? "0%" : "100%"}
            </div>
          </div>
        ) : null;
      case '오픈웨더':
        data = processedOpenWeatherData[selectedDate]?.entries.find(entry => entry["날짜 시간"].split(' ')[1].slice(0, 2) === hour.slice(0, 2));
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data["하늘 상태"])}
            </div>
            <div className="text-sm">{parseFloat(data["기온"].replace("°C", "")).toFixed(1)}°</div>
            <div className="text-xs text-blue-500">
              {data["강수 확률"]}
            </div>
          </div>
        ) : null;
      case '딥러닝모델':
        data = deepLearningData.find(entry => entry.date === selectedDate && entry.hour === hour);
        return data ? (
          <div className="flex flex-col items-center">
            <div className="flex">
              {getWeatherIcon(data.weatherCondition || '맑음')}
            </div>
            <div className="text-sm">{data.temperature || '-'}°</div>
            <div className="text-xs text-blue-500">
              {data.precipProbability || '0%'}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  const filteredKmaData = kmaData.filter(day => {
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);  // 날짜 비교를 위해 시간을 0으로 설정
    return dayDate >= today && dayDate <= endDate;
  });

  const renderDailyComparison = () => (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">날씨 제공자</TableHead>
          {filteredKmaData.map((day) => {
            const { month, day: dayNum, weekDay } = formatDate(day.date);
            const isToday = day.date === format(today, 'yyyy-MM-dd');
            return (
              <TableHead key={day.date} className="text-center px-1">
                <div className={`py-2 text-sm ${isToday ? 'bg-blue-500 text-white rounded-md' : ''}`}>
                  {isToday ? '오늘' : `${weekDay}`}
                  <br />
                  {`${month}.${dayNum}.`}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {['기상청', '아큐웨더', '오픈웨더', '딥러닝모델'].map((provider) => (
          <TableRow key={provider}>
            <TableCell className="font-medium">{provider}</TableCell>
            {filteredKmaData.map((day) => (
              <TableCell key={day.date} className="p-1">
                {renderDailyWeatherData(provider, day)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderHourlyComparison = () => {
    const hours = ['0300', '0600', '0900', '1200', '1500', '1800', '2100'];
    const currentHour = new Date().getHours();
    const closestHour = hours.reduce((prev, curr) => {
      const prevDiff = Math.abs(parseInt(prev) - currentHour);
      const currDiff = Math.abs(parseInt(curr) - currentHour);
      return prevDiff < currDiff ? prev : curr;
    });
    return (
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Table className="w-full md:w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">날씨 제공자</TableHead>
              {hours.map((hour) => (
                <TableHead key={hour} className={`text-center ${parseInt(hour) === parseInt(closestHour) && selectedDate === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-200' : ''}`}>
                  <div className="py-2 text-sm">
                    {`${hour.slice(0, 2)}:${hour.slice(2)}`}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {['기상청', '아큐웨더', '오픈웨더', '딥러닝모델'].map((provider) => (
              <TableRow key={provider}>
                <TableCell className="font-medium">{provider}</TableCell>
                {hours.map((hour) => (
                  <TableCell key={hour} className="p-1">
                    {renderHourlyWeatherData(provider, hour)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent className="p-2 sm:p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'outline'}
              onClick={() => setViewMode('daily')}
            >
              일자별
            </Button>
            <Button
              variant={viewMode === 'hourly' ? 'default' : 'outline'}
              onClick={() => setViewMode('hourly')}
            >
              시간별
            </Button>
          </div>
          {viewMode === 'hourly' && (
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="날짜 선택" />
              </SelectTrigger>
              <SelectContent>
                {filteredKmaData.map((day) => (
                  <SelectItem key={day.date} value={day.date}>
                    {day.date === format(today, 'yyyy-MM-dd') ? '오늘' : formatDate(day.date).month + '.' + formatDate(day.date).day} ({formatDate(day.date).weekDay})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {viewMode === 'daily' ? renderDailyComparison() : renderHourlyComparison()}
      </CardContent>
    </Card>
  );
}