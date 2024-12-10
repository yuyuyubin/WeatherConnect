export interface OpenWeatherEntry {
    "날짜 시간": string;
    "기온": string;
    "풍향": string;
    "풍속": string;
    "하늘 상태": string;
    "강수 형태": string;
    "강수 확률": string;
    "습도": string;
}

export interface ProcessedOpenWeatherData {
    date: string;
    entries: OpenWeatherEntry[];
    highTemp: number;
    lowTemp: number;
}

export function processOpenWeatherData(data: OpenWeatherEntry[]): ProcessedOpenWeatherData[] {
    const processedData: { [key: string]: ProcessedOpenWeatherData } = {};

    data.forEach((entry: OpenWeatherEntry) => {
        const date = entry["날짜 시간"].split(" ")[0];
        if (!processedData[date]) {
            processedData[date] = {
                date,
                entries: [],
                highTemp: -Infinity,
                lowTemp: Infinity,
            };
        }
        processedData[date].entries.push(entry);

        const temp = parseFloat(entry["기온"].replace("°C", ""));
        if (temp > processedData[date].highTemp) processedData[date].highTemp = temp;
        if (temp < processedData[date].lowTemp) processedData[date].lowTemp = temp;
    });

    return Object.values(processedData);
}

export const openWeatherData: OpenWeatherEntry[] = [
    
    {
        "날짜 시간": "20241210 0300",
        "기온": "5°C",
        "풍향": "북",
        "풍속": "2.59m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "56%"
    },
    {
        "날짜 시간": "20241210 0300",
        "기온": "6°C",
        "풍향": "북",
        "풍속": "3.09m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "56%"
    },
    {
        "날짜 시간": "20241210 0600",
        "기온": "7°C",
        "풍향": "북서",
        "풍속": "3.32m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "55%"
    },
    {
        "날짜 시간": "20241210 0900",
        "기온": "6°C",
        "풍향": "북",
        "풍속": "3.16m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "61%"
    },
    {
        "날짜 시간": "20241210 1200",
        "기온": "5°C",
        "풍향": "북동",
        "풍속": "2.47m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "69%"
    },
    {
        "날짜 시간": "20241210 1500",
        "기온": "5°C",
        "풍향": "북동",
        "풍속": "2.24m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "72%"
    },
    {
        "날짜 시간": "20241210 1800",
        "기온": "4°C",
        "풍향": "북동",
        "풍속": "2.06m/s",
        "하늘 상태": "맑음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "73%"
    },
    {
        "날짜 시간": "20241210 2100",
        "기온": "4°C",
        "풍향": "북동",
        "풍속": "1.54m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "71%"
    },
    {
        "날짜 시간": "20241211 0000",
        "기온": "5°C",
        "풍향": "북동",
        "풍속": "1.15m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "67%"
    },
    {
        "날짜 시간": "20241211 0300",
        "기온": "7°C",
        "풍향": "북",
        "풍속": "3.85m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "49%"
    },
    {
        "날짜 시간": "20241211 0600",
        "기온": "8°C",
        "풍향": "북서",
        "풍속": "4.36m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "45%"
    },
    {
        "날짜 시간": "20241211 0900",
        "기온": "6°C",
        "풍향": "북",
        "풍속": "5.17m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "54%"
    },
    {
        "날짜 시간": "20241211 1200",
        "기온": "4°C",
        "풍향": "북",
        "풍속": "3.11m/s",
        "하늘 상태": "구름 낱개",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "58%"
    },
    {
        "날짜 시간": "20241211 1500",
        "기온": "3°C",
        "풍향": "북",
        "풍속": "2.86m/s",
        "하늘 상태": "맑음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "58%"
    },
    {
        "날짜 시간": "20241211 1800",
        "기온": "2°C",
        "풍향": "북동",
        "풍속": "2.34m/s",
        "하늘 상태": "맑음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "59%"
    },
    {
        "날짜 시간": "20241211 2100",
        "기온": "1°C",
        "풍향": "북",
        "풍속": "0.9m/s",
        "하늘 상태": "맑음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "60%"
    },
    {
        "날짜 시간": "20241212 0000",
        "기온": "3°C",
        "풍향": "북동",
        "풍속": "3.06m/s",
        "하늘 상태": "구름 조금",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "55%"
    },
    {
        "날짜 시간": "20241212 0300",
        "기온": "6°C",
        "풍향": "북",
        "풍속": "5.67m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "38%"
    },
    {
        "날짜 시간": "20241212 0600",
        "기온": "7°C",
        "풍향": "북",
        "풍속": "5.31m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "34%"
    },
    {
        "날짜 시간": "20241212 0900",
        "기온": "5°C",
        "풍향": "북",
        "풍속": "3.48m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "45%"
    },
    {
        "날짜 시간": "20241212 1200",
        "기온": "4°C",
        "풍향": "북동",
        "풍속": "2.54m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "49%"
    },
    {
        "날짜 시간": "20241212 1500",
        "기온": "3°C",
        "풍향": "북동",
        "풍속": "1.15m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "52%"
    },
    {
        "날짜 시간": "20241212 1800",
        "기온": "3°C",
        "풍향": "북동",
        "풍속": "2.28m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "55%"
    },
    {
        "날짜 시간": "20241212 2100",
        "기온": "2°C",
        "풍향": "북동",
        "풍속": "1.85m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "58%"
    },
    {
        "날짜 시간": "20241213 0000",
        "기온": "3°C",
        "풍향": "북동",
        "풍속": "2.13m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "56%"
    },
    {
        "날짜 시간": "20241213 0300",
        "기온": "6°C",
        "풍향": "북서",
        "풍속": "1.65m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "50%"
    },
    {
        "날짜 시간": "20241213 0600",
        "기온": "6°C",
        "풍향": "서",
        "풍속": "4.34m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "62%"
    },
    {
        "날짜 시간": "20241213 0900",
        "기온": "4°C",
        "풍향": "북",
        "풍속": "2.79m/s",
        "하늘 상태": "가벼운 비",
        "강수 형태": "없음",
        "강수 확률": "100%",
        "습도": "94%"
    },
    {
        "날짜 시간": "20241213 1200",
        "기온": "3°C",
        "풍향": "북동",
        "풍속": "2.34m/s",
        "하늘 상태": "눈",
        "강수 형태": "없음",
        "강수 확률": "100%",
        "습도": "80%"
    },
    {
        "날짜 시간": "20241213 1500",
        "기온": "3°C",
        "풍향": "북",
        "풍속": "4.86m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "60%"
    },
    {
        "날짜 시간": "20241213 1800",
        "기온": "3°C",
        "풍향": "북",
        "풍속": "5.36m/s",
        "하늘 상태": "가벼운 비",
        "강수 형태": "없음",
        "강수 확률": "20%",
        "습도": "59%"
    },
    {
        "날짜 시간": "20241213 2100",
        "기온": "2°C",
        "풍향": "북",
        "풍속": "3.2m/s",
        "하늘 상태": "구름 낱개",
        "강수 형태": "없음",
        "강수 확률": "11%",
        "습도": "64%"
    },
    {
        "날짜 시간": "20241214 0000",
        "기온": "3°C",
        "풍향": "북",
        "풍속": "3.3m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "2%",
        "습도": "60%"
    },
    {
        "날짜 시간": "20241214 0300",
        "기온": "6°C",
        "풍향": "북서",
        "풍속": "7.29m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "49%"
    },
    {
        "날짜 시간": "20241214 0600",
        "기온": "6°C",
        "풍향": "북서",
        "풍속": "8.1m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "51%"
    },
    {
        "날짜 시간": "20241214 0900",
        "기온": "4°C",
        "풍향": "북서",
        "풍속": "7.49m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "54%"
    },
    {
        "날짜 시간": "20241214 1200",
        "기온": "4°C",
        "풍향": "북서",
        "풍속": "6.19m/s",
        "하늘 상태": "구름 많음",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "56%"
    },
    {
        "날짜 시간": "20241214 1500",
        "기온": "4°C",
        "풍향": "북서",
        "풍속": "7.23m/s",
        "하늘 상태": "흐림",
        "강수 형태": "없음",
        "강수 확률": "0%",
        "습도": "55%"
    },
    {
        "날짜 시간": "20241214 1800",
        "기온": "4°C",
        "풍향": "북서",
        "풍속": "8.13m/s",
        "하늘 상태": "가벼운 눈",
        "강수 형태": "없음",
        "강수 확률": "20%",
        "습도": "52%"
    },
    {
        "날짜 시간": "20241214 2100",
        "기온": "3°C",
        "풍향": "북서",
        "풍속": "5.52m/s",
        "하늘 상태": "가벼운 눈",
        "강수 형태": "없음",
        "강수 확률": "20%",
        "습도": "59%"
    },
    {
        "날짜 시간": "20241215 0000",
        "기온": "5°C",
        "풍향": "북서",
        "풍속": "6.01m/s",
        "하늘 상태": "가벼운 눈",
        "강수 형태": "없음",
        "강수 확률": "20%",
        "습도": "52%"
    }
];

export async function initializeOpenWeatherData(): Promise<OpenWeatherEntry[]> {
    // This function can be used to fetch data dynamically if needed
    // For now, we're returning the static data
    return openWeatherData;
}
