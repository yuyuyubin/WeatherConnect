import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun } from 'lucide-react'

export function getWeatherIcon(description: string) {
  const lowercaseDesc = description.toLowerCase()
  if (lowercaseDesc.includes('맑음') || lowercaseDesc.includes('clear')) return Sun
  if (lowercaseDesc.includes('구름') || lowercaseDesc.includes('cloud')) return Cloud
  if (lowercaseDesc.includes('비') || lowercaseDesc.includes('rain')) return CloudRain
  if (lowercaseDesc.includes('이슬비') || lowercaseDesc.includes('drizzle')) return CloudDrizzle
  if (lowercaseDesc.includes('눈') || lowercaseDesc.includes('snow')) return CloudSnow
  if (lowercaseDesc.includes('번개') || lowercaseDesc.includes('thunder')) return CloudLightning
  return Sun
}

