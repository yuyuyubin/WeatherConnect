import os
import requests
from datetime import datetime
import json

# OpenWeather API 설정
API_KEY = '490c69187902ac525169179b75568c4c'
api_url = 'https://api.openweathermap.org/data/2.5/forecast'

# 군산 위치 정보
lat = '35.967'
lon = '126.736'

params = {
    'lat': lat,
    'lon': lon,
    'appid': API_KEY,
    'units': 'metric',
    'cnt': '40'  # 5일간 3시간 간격의 예보 데이터
}

response = requests.get(api_url, params=params)

# JSON 응답 데이터 처리
try:
    data = response.json()
    forecast_list = data.get('list', [])
    forecast_info = []

    # 날씨 설명 영어 -> 한글 매핑
    weather_desc_mapping = {
        'clear sky': '맑음',
        'few clouds': '구름 조금',
        'scattered clouds': '구름 낱개',
        'broken clouds': '구름 많음',
        'overcast clouds': '흐림',
        'light rain': '가벼운 비',
        'moderate rain': '보통 비',
        'heavy intensity rain': '강한 비',
        'light snow': '가벼운 눈',
        'snow': '눈',
        'mist': '안개',
    }

    for item in forecast_list:
        forecast_date_time = item.get('dt_txt')
        date_time_obj = datetime.strptime(forecast_date_time, "%Y-%m-%d %H:%M:%S")
        formatted_date_time = date_time_obj.strftime("%Y%m%d %H%M")

        temp = round(item.get('main', {}).get('temp', 0))
        humidity = item.get('main', {}).get('humidity', 'N/A')
        wind_speed = item.get('wind', {}).get('speed', 'N/A')
        wind_deg = item.get('wind', {}).get('deg', 0)
        pop = round(item.get('pop', 0) * 100)  # 강수확률
        weather_desc = item.get('weather', [{}])[0].get('description', '정보 없음')
        weather_desc_kr = weather_desc_mapping.get(weather_desc, '정보 없음')

        # 풍향 계산
        wind_direction = '정보 없음'
        if wind_deg is not None:
            directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
            wind_index = int((wind_deg + 22.5) // 45) % 8
            wind_direction = directions[wind_index]

        # 데이터 항목 추가
        forecast_entry = {
            '날짜 시간': formatted_date_time,
            '기온': f"{temp}°C",
            '풍향': wind_direction,
            '풍속': f"{wind_speed}m/s",
            '하늘 상태': weather_desc_kr,
            '강수 형태': '없음',  # OpenWeather는 강수 형태 데이터를 제공하지 않음
            '강수 확률': f"{pop}%",
            '습도': f"{humidity}%",
        }
        forecast_info.append(forecast_entry)

    # TypeScript 파일 생성
    ts_output_path = os.path.join(os.path.dirname(__file__), 'openWeather.ts')
    with open(ts_output_path, 'w', encoding='utf-8') as ts_file:
        ts_file.write("export interface OpenWeatherEntry {\n")
        ts_file.write('    "날짜 시간": string;\n')
        ts_file.write('    "기온": string;\n')
        ts_file.write('    "풍향": string;\n')
        ts_file.write('    "풍속": string;\n')
        ts_file.write('    "하늘 상태": string;\n')
        ts_file.write('    "강수 형태": string;\n')
        ts_file.write('    "강수 확률": string;\n')
        ts_file.write('    "습도": string;\n')
        ts_file.write("}\n\n")
        ts_file.write("export interface ProcessedOpenWeatherData {\n")
        ts_file.write('    date: string;\n')
        ts_file.write('    entries: OpenWeatherEntry[];\n')
        ts_file.write('    highTemp: number;\n')
        ts_file.write('    lowTemp: number;\n')
        ts_file.write("}\n\n")
        ts_file.write("export function processOpenWeatherData(data: OpenWeatherEntry[]): ProcessedOpenWeatherData[] {\n")
        ts_file.write("    const processedData: { [key: string]: ProcessedOpenWeatherData } = {};\n\n")
        ts_file.write("    data.forEach((entry: OpenWeatherEntry) => {\n")
        ts_file.write('        const date = entry["날짜 시간"].split(" ")[0];\n')
        ts_file.write("        if (!processedData[date]) {\n")
        ts_file.write("            processedData[date] = {\n")
        ts_file.write("                date,\n")
        ts_file.write("                entries: [],\n")
        ts_file.write("                highTemp: -Infinity,\n")
        ts_file.write("                lowTemp: Infinity,\n")
        ts_file.write("            };\n")
        ts_file.write("        }\n")
        ts_file.write("        processedData[date].entries.push(entry);\n\n")
        ts_file.write('        const temp = parseFloat(entry["기온"].replace("°C", ""));\n')
        ts_file.write("        if (temp > processedData[date].highTemp) processedData[date].highTemp = temp;\n")
        ts_file.write("        if (temp < processedData[date].lowTemp) processedData[date].lowTemp = temp;\n")
        ts_file.write("    });\n\n")
        ts_file.write("    return Object.values(processedData);\n")
        ts_file.write("}\n\n")
        ts_file.write("export const openWeatherData: OpenWeatherEntry[] = ")
        json.dump(forecast_info, ts_file, ensure_ascii=False, indent=4)
        ts_file.write(";\n\n")
        ts_file.write("export async function initializeOpenWeatherData(): Promise<OpenWeatherEntry[]> {\n")
        ts_file.write("    // This function can be used to fetch data dynamically if needed\n")
        ts_file.write("    // For now, we're returning the static data\n")
        ts_file.write("    return openWeatherData;\n")
        ts_file.write("}\n")

    print(f"TypeScript 파일이 '{ts_output_path}'에 저장되었습니다.")

except Exception as e:
    print(f"데이터 처리 중 오류 발생: {e}")
