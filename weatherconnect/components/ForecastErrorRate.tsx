import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { loadWeatherData, WeatherDataSet } from "../utils/weatherData";

interface RawWeatherData {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipProb: number; // 강수확률
}

const ForecastErrorRate: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date("2024-01-01"),
    to: new Date("2024-01-01"),
  });

  const [weatherDataSet, setWeatherDataSet] = useState<WeatherDataSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<any>({});
  const [errorData, setErrorData] = useState<any[]>([]);
  const [averageErrorRates, setAverageErrorRates] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadWeatherData();
        setWeatherDataSet(data);
      } catch (err) {
        console.error("Error loading weather data:", err);
        setError(`날씨 데이터를 불러오는 중 오류가 발생했습니다: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!weatherDataSet) return;

    const { actualWeather, kmaForecast, openWeather, accuWeather } = weatherDataSet;

    const filterByDateRange = (data: RawWeatherData[]) =>
      data.filter((item) => new Date(item.date) >= (dateRange.from || new Date()) && new Date(item.date) <= (dateRange.to || new Date()));

    const filtered = {
      actualData: filterByDateRange(actualWeather),
      kmaData: filterByDateRange(kmaForecast),
      openWeatherData: filterByDateRange(openWeather),
      accuWeatherData: filterByDateRange(accuWeather),
    };
    setFilteredData(filtered);

    const calculateTempError = (forecast: number | undefined, actual: number | undefined) => {
      if (forecast === undefined || actual === undefined) return null;
      return Math.abs(forecast - actual);
    };

    const calculatePrecipError = (forecast: number | undefined, actual: number | undefined) => {
      if (forecast === undefined || actual === undefined) return null;

      // 실제 강수 여부: actual > 50이면 100(비 옴), 아니면 0(비 안 옴)
      const actualPrecip = actual > 50 ? 100 : 0;

      // 오차 계산
      return Math.abs(forecast - actualPrecip);
    };

    const errors = filtered.actualData.map((actualEntry) => {
      const date = actualEntry.date;
      const kmaEntry = filtered.kmaData.find((d) => d.date === date);
      const openWeatherEntry = filtered.openWeatherData.find((d) => d.date === date);
      const accuWeatherEntry = filtered.accuWeatherData.find((d) => d.date === date);

      return {
        date,
        kmaTempError: calculateTempError(kmaEntry?.avgTemp, actualEntry.avgTemp),
        openWeatherTempError: calculateTempError(openWeatherEntry?.avgTemp, actualEntry.avgTemp),
        accuWeatherTempError: calculateTempError(accuWeatherEntry?.avgTemp, actualEntry.avgTemp),
        kmaPrecipError: calculatePrecipError(kmaEntry?.precipProb, actualEntry.precipProb),
        openWeatherPrecipError: calculatePrecipError(openWeatherEntry?.precipProb, actualEntry.precipProb),
        accuWeatherPrecipError: calculatePrecipError(accuWeatherEntry?.precipProb, actualEntry.precipProb),
      };
    });
    setErrorData(errors);

    const calculateAverage = (key: keyof typeof errors[0]) => {
      const validErrors = errors.map((entry) => entry[key]).filter((error) => error !== null) as number[];
      return validErrors.length > 0 ? validErrors.reduce((sum, error) => sum + error, 0) / validErrors.length : null;
    };

    setAverageErrorRates({
      avgKmaTempError: calculateAverage("kmaTempError"),
      avgOpenWeatherTempError: calculateAverage("openWeatherTempError"),
      avgAccuWeatherTempError: calculateAverage("accuWeatherTempError"),
      avgKmaPrecipError: calculateAverage("kmaPrecipError"),
      avgOpenWeatherPrecipError: calculateAverage("openWeatherPrecipError"),
      avgAccuWeatherPrecipError: calculateAverage("accuWeatherPrecipError"),
    });
  }, [weatherDataSet, dateRange]);

  const renderChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={errorData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => (value ? `${value.toFixed(2)}` : "N/A")} />
        <Legend />
        <Line type="monotone" dataKey="kmaTempError" stroke="#8884d8" name="기상청 기온 오차" connectNulls />
        <Line type="monotone" dataKey="openWeatherTempError" stroke="#82ca9d" name="OpenWeather 기온 오차" connectNulls />
        <Line type="monotone" dataKey="accuWeatherTempError" stroke="#ffc658" name="AccuWeather 기온 오차" connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card className="w-full max-w-4xl">
      <CardContent>
        <div className="mb-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div className="mb-4">
          <p>평균 기온 오차 (선택된 구간):</p>
          <ul>
            <li>기상청: {averageErrorRates?.avgKmaTempError?.toFixed(2)}°</li>
            <li>OpenWeather: {averageErrorRates?.avgOpenWeatherTempError?.toFixed(2)}°</li>
            <li>AccuWeather: {averageErrorRates?.avgAccuWeatherTempError?.toFixed(2)}°</li>
          </ul>
          <p>평균 강수확률 오차 (선택된 구간):</p>
          <ul>
            <li>기상청: {averageErrorRates?.avgKmaPrecipError?.toFixed(2)}%</li>
            <li>OpenWeather: {averageErrorRates?.avgOpenWeatherPrecipError?.toFixed(2)}%</li>
            <li>AccuWeather: {averageErrorRates?.avgAccuWeatherPrecipError?.toFixed(2)}%</li>
          </ul>
        </div>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ForecastErrorRate;
