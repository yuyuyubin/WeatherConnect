import os
import requests
from datetime import datetime
import json

SERVICE_KEY = 'i/w+gFd2aGSo5yROBlUMMkXfVnmA2mwWDRy4Xl2S/Ta56NOqQND32O4aNHy6AYzXa44/BsUQX5HdDYxKHxicZg=='

api_url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'

# 현재 날짜 기준으로 05시 데이터를 요청
current_time_kst = datetime.now()
base_date = current_time_kst.strftime('%Y%m%d')
base_time = '0500'

# 관측 위치 : 전라북도 군산시 (nx=58, ny=92)
params = {
    'serviceKey': SERVICE_KEY,
    'numOfRows': '1000',
    'dataType': 'JSON',
    'base_date': base_date,
    'base_time': base_time,
    'nx': '58',
    'ny': '92',
    'pageNo': '1'
}

response = requests.get(api_url, params=params)

# 응답 데이터 JSON 형태로 파싱
try:
    data = response.json()
    items = data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
    
    forecast_info = []
    for item in items:
        forecast_date = item.get('fcstDate')
        forecast_time = item.get('fcstTime')
        category = item.get('category')
        value = item.get('fcstValue')
        
        # 날짜와 시간이 새 항목일 때 추가
        date_time_str = f"{forecast_date} {forecast_time}"
        forecast_entry = next((entry for entry in forecast_info if entry['날짜 시간'] == date_time_str), None)
        if not forecast_entry:
            forecast_entry = {'날짜 시간': date_time_str}
            forecast_info.append(forecast_entry)
        
        # 항목별 데이터 추가
        if category == 'TMP':
            forecast_entry['기온'] = f"{value}°C"
        elif category == 'TMN':
            forecast_entry['최저기온'] = f"{value}°C"
        elif category == 'TMX':
            forecast_entry['최고기온'] = f"{value}°C"
        elif category == 'REH':
            forecast_entry['습도'] = f"{value}%"
        elif category == 'WSD':
            forecast_entry['풍속'] = f"{value}m/s"
        elif category == 'VEC':
            direction_mapping = {
                (0, 22.5): '북',
                (22.5, 67.5): '북동',
                (67.5, 112.5): '동',
                (112.5, 157.5): '남동',
                (157.5, 202.5): '남',
                (202.5, 247.5): '남서',
                (247.5, 292.5): '서',
                (292.5, 337.5): '북서',
                (337.5, 360): '북'
            }
            wind_direction = next((name for (low, high), name in direction_mapping.items() if low <= float(value) < high), '정보 없음')
            forecast_entry['풍향'] = wind_direction
        elif category == 'PTY':
            pty_mapping = {
                '0': '없음',
                '1': '비',
                '2': '비/눈',
                '3': '눈',
                '4': '소나기'
            }
            forecast_entry['강수 형태'] = pty_mapping.get(value, '정보 없음')
        elif category == 'POP':
            forecast_entry['강수확률'] = f"{value}%"
        elif category == 'SKY':
            sky_mapping = {
                '1': '맑음',
                '3': '구름 많음',
                '4': '흐림'
            }
            forecast_entry['하늘 상태'] = sky_mapping.get(value, '정보 없음')
    
    # JSON 파일 저장
    output_path = os.path.join(os.path.dirname(__file__), 'kor_gunsan_3days.json')
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(forecast_info, json_file, ensure_ascii=False, indent=4)
    
    # TypeScript 인터페이스와 데이터 출력
    ts_output_path = os.path.join(os.path.dirname(__file__), 'kmaShortTerm.ts')
    with open(ts_output_path, 'w', encoding='utf-8') as ts_file:
        ts_file.write("export interface KMAShortTermEntry {\n")
        ts_file.write('  "날짜 시간": string;\n')
        ts_file.write('  "기온": string;\n')
        ts_file.write('  "풍향": string;\n')
        ts_file.write('  "풍속": string;\n')
        ts_file.write('  "하늘 상태": string;\n')
        ts_file.write('  "강수 형태": string;\n')
        ts_file.write('  "강수확률": string;\n')
        ts_file.write('  "습도": string;\n')
        ts_file.write('  "최고기온"?: string;\n')
        ts_file.write('  "최저기온"?: string;\n')
        ts_file.write("}\n\n")
        
        ts_file.write("export const kmaShortTermData: KMAShortTermEntry[] = ")
        json.dump(forecast_info, ts_file, ensure_ascii=False, indent=2)
        ts_file.write(";\n\n")
        
        ts_file.write("export async function initializeKMAShortTermData() {\n")
        ts_file.write("  // This function can be used to fetch data dynamically if needed\n")
        ts_file.write("  // For now, it's not necessary as we're using the static data above\n")
        ts_file.write("}\n")
    
    print(f"TypeScript 데이터가 '{ts_output_path}'에 저장되었습니다.")

except ValueError as e:
    print(f"Failed to parse JSON: {e}")
