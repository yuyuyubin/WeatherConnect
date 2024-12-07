"use client";

import * as React from "react";
import { ChevronsUpDown } from 'lucide-react';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const weatherSources = [
  { value: "kma", label: "기상청" },
  { value: "openWeather", label: "OpenWeather" },
  { value: "accuWeather", label: "AccuWeather" },
  { value: "deepLearning", label: "딥러닝 모델" },
];

interface WeatherSourceSelectorProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
  onComparisonToggle: () => void;
  onForecastErrorRateToggle: () => void;
  errorRates?: {
    kmaTemp: number | null;
    openWeatherTemp: number | null;
    accuWeatherTemp: number | null;
    kmaPrecip: number | null;
    openWeatherPrecip: number | null;
    accuWeatherPrecip: number | null;
  };
}

export function WeatherSourceSelector({
  selectedSource,
  onSourceChange,
  onComparisonToggle,
  onForecastErrorRateToggle,
  errorRates,
}: WeatherSourceSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        onClick={onForecastErrorRateToggle}
        className="mr-2"
      >
        오보율 계산
      </Button>
      <Button
        variant="outline"
        onClick={onComparisonToggle}
        className="mr-2"
      >
        날씨 비교
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[240px] flex items-center justify-center bg-white hover:bg-gray-100 transition-colors text-center text-sm"
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex-grow text-center">
                {selectedSource
                  ? weatherSources.find((source) => source.value === selectedSource)?.label
                  : "날씨 데이터 소스 선택"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-1 rounded-md shadow-lg">
          <Command className="w-full">
            <CommandEmpty>소스를 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup className="overflow-hidden">
              {weatherSources.map((source) => (
                <CommandItem
                  key={source.value}
                  value={source.value}
                  onSelect={(currentValue) => {
                    onSourceChange(
                      currentValue === selectedSource ? selectedSource : currentValue
                    );
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer transition-colors flex items-center justify-between py-1.5 px-1.5 m-1 rounded-md text-sm", // justify-between 추가
                    selectedSource === source.value
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div> {/* 텍스트와 오차율을 묶는 div 추가 */}
                    {source.label}
                  </div>
                  {errorRates && (
                    <span className="ml-2 text-xs text-gray-500">
                      {source.value === "kma" && errorRates.kmaTemp !== null && errorRates.kmaPrecip !== null
                        ? `(기온: ${errorRates.kmaTemp.toFixed(1)}%, 강수: ${errorRates.kmaPrecip.toFixed(1)}%)`
                        : source.value === "openWeather" && errorRates.openWeatherTemp !== null && errorRates.openWeatherPrecip !== null
                        ? `(기온: ${errorRates.openWeatherTemp.toFixed(1)}%, 강수: ${errorRates.openWeatherPrecip.toFixed(1)}%)`
                        : source.value === "accuWeather" && errorRates.accuWeatherTemp !== null && errorRates.accuWeatherPrecip !== null
                        ? `(기온: ${errorRates.accuWeatherTemp.toFixed(1)}%, 강수: ${errorRates.accuWeatherPrecip.toFixed(1)}%)`
                        : null}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

