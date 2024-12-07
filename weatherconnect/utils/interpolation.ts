import { WeatherData } from './weatherData';

export function interpolateData(data: WeatherData[], startDate: Date, endDate: Date): WeatherData[] {
  const interpolatedData: WeatherData[] = [];
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const currentDateString = currentDate.toISOString().split('T')[0];
    const exactMatch = sortedData.find(d => d.date === currentDateString);

    if (exactMatch) {
      interpolatedData.push(exactMatch);
    } else {
      const prevData = sortedData.filter(d => new Date(d.date) < currentDate).pop();
      const nextData = sortedData.find(d => new Date(d.date) > currentDate);

      if (prevData && nextData) {
        const totalDays = (new Date(nextData.date).getTime() - new Date(prevData.date).getTime()) / (1000 * 60 * 60 * 24);
        const daysFromPrev = (currentDate.getTime() - new Date(prevData.date).getTime()) / (1000 * 60 * 60 * 24);
        const interpolationFactor = daysFromPrev / totalDays;

        interpolatedData.push({
          date: currentDateString,
          temperature: prevData.temperature + (nextData.temperature - prevData.temperature) * interpolationFactor,
          precipitation: prevData.precipitation + (nextData.precipitation - prevData.precipitation) * interpolationFactor
        });
      } else {
        // If we can't interpolate, use the nearest available data point
        const nearestData = prevData || nextData;
        if (nearestData) {
          interpolatedData.push({
            date: currentDateString,
            temperature: nearestData.temperature,
            precipitation: nearestData.precipitation
          });
        }
      }
    }
  }

  return interpolatedData;
}

