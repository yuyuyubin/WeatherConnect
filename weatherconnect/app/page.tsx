'use client'

import { useState, useEffect, useMemo, useCallback } from 'react';
import { WeatherForecast } from '../components/WeatherForecast';
import { WeatherOverview } from '../components/WeatherOverview';
import { WeatherSourceSelector } from '../components/WeatherSourceSelector';
import { processWeatherData, ProcessedWeatherData } from '../utils/processWeatherData';
import { MapPin } from 'lucide-react';
import { getFormattedDate } from '../utils/dateUtils';
import { OpenWeatherForecast } from '../components/OpenWeatherForecast';
import { AccuWeatherForecast } from '../components/AccuWeatherForecast';
import { DeepLearningForecast, DeepLearningForecastEntry } from '../components/DeepLearningForecast';
import { WeatherComparison } from '../components/WeatherComparison';
import { loadWeatherData, WeatherDataSet } from '../utils/weatherData';
import { OpenWeatherEntry, initializeOpenWeatherData } from '../utils/openWeather';
import { AccuWeatherEntry, initializeAccuWeatherData } from '../utils/accuWeather';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogDescription } from '@/components/ui/dialog';
import { SiteUsageDashboard } from '../components/SiteUsageDashboard';
import { Button } from '@/components/ui/button';
import ForecastErrorRate from '../components/ForecastErrorRate';
import deepLearningData from '../utils/deep_learning_data.json';

export default function Home() {
  const [weatherData, setWeatherData] = useState<{
    processedData: ProcessedWeatherData[];
    openWeatherData: OpenWeatherEntry[];
    accuWeatherData: AccuWeatherEntry[];
    deepLearningData: DeepLearningForecastEntry[];
    weatherDataSet: WeatherDataSet | null;
  }>({
    processedData: [],
    openWeatherData: [],
    accuWeatherData: [],
    deepLearningData: deepLearningData as DeepLearningForecastEntry[],
    weatherDataSet: null,
  });

  const [selectedSource, setSelectedSource] = useState<"kma" | "openWeather" | "accuWeather" | "deepLearning">('kma');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(new Date()));
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isForecastErrorRateOpen, setIsForecastErrorRateOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const handleCloseDashboard = useCallback(() => {
    setShowDashboard(false);
  }, []);

  const handleShowDashboard = useCallback(() => {
    setShowDashboard(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadWeatherData();
        const processedKMAData = processWeatherData();
        const openWeatherEntries = await initializeOpenWeatherData();
        const accuWeatherEntries = await initializeAccuWeatherData();

        setWeatherData({
          processedData: processedKMAData,
          openWeatherData: openWeatherEntries,
          accuWeatherData: accuWeatherEntries,
          deepLearningData: deepLearningData as DeepLearningForecastEntry[],
          weatherDataSet: data,
        });
      } catch (err) {
        console.error('Error loading weather data:', err);
        setError(
          `날씨 데이터를 불러오는 중 오류가 발생했습니다: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentWeatherData = useMemo(() => {
    if (selectedSource === 'deepLearning') {
      return weatherData.deepLearningData.length > 0 ? weatherData.deepLearningData[0] : null;
    }
    switch (selectedSource) {
      case 'kma':
        return weatherData.processedData?.[0] || null;
      case 'openWeather':
        return weatherData.openWeatherData?.[0] || null;
      case 'accuWeather':
        return weatherData.accuWeatherData?.[0] || null;
      default:
        return null;
    }
  }, [selectedSource, weatherData]);

  const handleSourceChange = useCallback((source: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setSelectedSource(source as any); 
      setTransitioning(false);
    }, 300);
  }, []);

  const handleComparisonToggle = useCallback(() => {
    setIsComparisonOpen(true);
  }, []);

  const handleForecastErrorRateToggle = useCallback(() => {
    setIsForecastErrorRateOpen(true);
  }, []);

  const renderWeatherContent = useMemo(() => {
    if (loading) {
      return <div className="flex justify-center items-center h-screen">데이터를 불러오는 중...</div>;
    }

    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!currentWeatherData) {
      return (
        <div className="flex justify-center items-center h-screen">
          선택한 소스의 날씨 데이터를 불러올 수 없습니다.
        </div>
      );
    }

    return (
      <div
        className={`w-full max-w-4xl mx-auto transition-all transform ${
          transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <WeatherOverview
          currentWeather={currentWeatherData}
          source={selectedSource as any} 
        />
        <div className="mt-4">
          {selectedSource === 'kma' && (
            <WeatherForecast
              data={weatherData.processedData}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
          {selectedSource === 'openWeather' && (
            <OpenWeatherForecast data={weatherData.openWeatherData} />
          )}
          {selectedSource === 'accuWeather' && (
            <AccuWeatherForecast data={weatherData.accuWeatherData} />
          )}
          {selectedSource === 'deepLearning' && (
            <DeepLearningForecast data={weatherData.deepLearningData} />
          )}
        </div>
      </div>
    );
  }, [loading, error, currentWeatherData, selectedSource, weatherData, selectedDate, transitioning]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        selectedSource === 'kma'
          ? 'bg-blue-50'
          : selectedSource === 'openWeather'
          ? 'bg-green-50'
          : selectedSource === 'accuWeather'
          ? 'bg-purple-50'
          : 'bg-gray-100'
      }`}
    >
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">WeatherConnect</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>군산시</span>
            </div>
          </div>
          <WeatherSourceSelector
            selectedSource={selectedSource}
            onSourceChange={handleSourceChange}
            onComparisonToggle={handleComparisonToggle}
            onForecastErrorRateToggle={handleForecastErrorRateToggle}
          />
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center py-6 px-4 max-w-4xl mx-auto w-full">
        {renderWeatherContent}
      </main>
      <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
        <DialogContent className="max-w-[90vw] w-full sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>날씨 비교</DialogTitle>
          </DialogHeader>
          <WeatherComparison
            kmaData={weatherData.processedData}
            openWeatherData={weatherData.openWeatherData}
            accuWeatherData={weatherData.accuWeatherData}
            deepLearningData={weatherData.deepLearningData}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isForecastErrorRateOpen} onOpenChange={setIsForecastErrorRateOpen}>
        <DialogContent className="max-w-[90vw] w-full sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>기상 예보 오보율</DialogTitle>
            <DialogDescription>
              각 기상 예보 서비스의 일별 기온 예측 오차를 비교합니다.
            </DialogDescription>
          </DialogHeader>
          {weatherData.weatherDataSet && (
            <ForecastErrorRate
              actualData={weatherData.weatherDataSet.actualWeather}
              kmaData={weatherData.weatherDataSet.kmaForecast}
              openWeatherData={weatherData.weatherDataSet.openWeatherForecast}
              accuWeatherData={weatherData.weatherDataSet.accuWeatherForecast}
            />
          )}
        </DialogContent>
      </Dialog>
      {showDashboard && <SiteUsageDashboard onClose={handleCloseDashboard} />}
      <Button onClick={handleShowDashboard} className="fixed bottom-4 right-4">
        사용법
      </Button>
    </div>
  );
}

