# accuweather.py
import os
import requests
from datetime import datetime
import json

ACCUWEATHER_API_KEY = 'fVLUfBekQdIJiJGFyAqsG2TpA6DsxgZV'
accuweather_location_key = '226396'  # 군산의 Location Key
accuweather_api_url = f'http://dataservice.accuweather.com/forecasts/v1/daily/5day/{accuweather_location_key}'

params_accuweather = {
    'apikey': ACCUWEATHER_API_KEY,
    'metric': 'true'
}

response_accuweather = requests.get(accuweather_api_url, params=params_accuweather)

# 날씨 설명 영어 -> 한글 매핑 딕셔너리
weather_desc_mapping = {
    'sunny': '맑음',
    'mostly sunny': '대체로 맑음',
    'partly sunny': '부분적으로 맑음',
    'intermittent clouds': '간헐적 구름',
    'hazy sunshine': '흐린 햇빛',
    'mostly cloudy': '대체로 흐림',
    'cloudy': '흐림',
    'dreary (overcast)': '음산함 (흐림)',
    'fog': '안개',
    'showers': '소나기',
    'partly sunny w/ showers': '부분적으로 맑음, 소나기',
    'mostly cloudy w/ showers': '대체로 흐림, 소나기',
    'partly sunny w/ t-storms': '부분적으로 맑음, 뇌우',
    'mostly cloudy w/ t-storms': '대체로 흐림, 뇌우',
    'rain': '비',
    'flurries': '눈보라',
    'mostly cloudy w/ flurries': '대체로 흐림, 눈보라',
    'partly sunny w/ flurries': '부분적으로 맑음, 눈보라',
    'snow': '눈',
    'mostly cloudy w/ snow': '대체로 흐림, 눈',
    'ice': '얼음',
    'sleet': '진눈깨비',
    'freezing rain': '언 비',
    'rain and snow': '비와 눈',
    'hot': '더움',
    'cold': '추움',
    'windy': '바람부는',
    'clear': '맑음',
    'mostly clear': '대체로 맑음',
    'partly cloudy': '부분적으로 흐림',
    'hazy moonlight': '흐린 달빛',
    'partly cloudy w/ showers': '부분적으로 흐림, 소나기',
    'mostly cloudy w/ showers': '대체로 흐림, 소나기',
    'partly cloudy w/ t-storms': '부분적으로 흐림, 뇌우',
    'mostly cloudy w/ t-storms': '대체로 흐림, 뇌우',
    'mostly cloudy w/ flurries': '대체로 흐림, 눈보라',
    'mostly cloudy w/ snow': '대체로 흐림, 눈'
}

# AccuWeather 응답 데이터 JSON 형태로 파싱
try:
    data_accuweather = response_accuweather.json()
    daily_forecasts = data_accuweather.get('DailyForecasts', [])
    forecast_info_accuweather = []

    for forecast in daily_forecasts:
        date = forecast.get('Date')
        date_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S%z")
        formatted_date = date_obj.strftime("%Y%m%d %H%M")

        min_temp = forecast.get('Temperature', {}).get('Minimum', {}).get('Value')
        max_temp = forecast.get('Temperature', {}).get('Maximum', {}).get('Value')
        day_desc = forecast.get('Day', {}).get('IconPhrase')
        night_desc = forecast.get('Night', {}).get('IconPhrase')
        wind_speed = forecast.get('Day', {}).get('Wind', {}).get('Speed', {}).get('Value')
        wind_direction = forecast.get('Day', {}).get('Wind', {}).get('Direction', {}).get('Localized')
        humidity = forecast.get('Day', {}).get('RelativeHumidity')
        precipitation_type = forecast.get('Day', {}).get('PrecipitationType', '없음')

        # 날씨 설명 영어 -> 한글 매핑
        day_desc_kr = weather_desc_mapping.get(day_desc.lower(), '정보 없음')
        night_desc_kr = weather_desc_mapping.get(night_desc.lower(), '정보 없음')

        forecast_entry_accuweather = {
            '날짜': formatted_date,
            '최저기온': f"{min_temp}°C",
            '최고기온': f"{max_temp}°C",
            '낮 날씨': day_desc_kr,
            '밤 날씨': night_desc_kr,
            '풍속': f"{wind_speed}m/s",
            '풍향': wind_direction,
            '습도': f"{humidity}%",
            '강수 형태': precipitation_type
        }
        forecast_info_accuweather.append(forecast_entry_accuweather)

    # 읽기 쉽게 출력
    for entry in forecast_info_accuweather:
        for key, val in entry.items():
            print(f"{key}: {val}")
        print("-----------------")

    # JSON 파일로 저장
    output_path = os.path.join(os.path.dirname(__file__), 'Accu_gunsan_5days.json')
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(forecast_info_accuweather, json_file, ensure_ascii=False, indent=4)
except ValueError as e:
    print(f"Failed to parse JSON: {e}")
