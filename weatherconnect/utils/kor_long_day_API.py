import os
import requests
from datetime import datetime, timedelta
import json

SERVICE_KEY = 'i/w+gFd2aGSo5yROBlUMMkXfVnmA2mwWDRy4Xl2S/Ta56NOqQND32O4aNHy6AYzXa44/BsUQX5HdDYxKHxicZg=='

mid_term_land_api_url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst'
mid_term_temp_api_url = 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa'

# 관측 위치 : 전라북도 군산시
current_time_kst = datetime.now()
base_date = current_time_kst.strftime('%Y%m%d')
base_time = '0600'  # 오전 6시 기준 발표

# 육상 예보 요청 파라미터
land_params = {
    'serviceKey': SERVICE_KEY,
    'numOfRows': '10',
    'dataType': 'JSON',
    'regId': '11F10000',
    'tmFc': f"{base_date}{base_time}"
}

# 기온 예보 요청 파라미터
temp_params = {
    'serviceKey': SERVICE_KEY,
    'numOfRows': '10',
    'dataType': 'JSON',
    'regId': '21F10501',
    'tmFc': f"{base_date}{base_time}"
}

# 육상 예보 요청
land_response = requests.get(mid_term_land_api_url, params=land_params)

# 기온 예보 요청
temp_response = requests.get(mid_term_temp_api_url, params=temp_params)

try:
    # JSON 파싱
    land_data = land_response.json()
    temp_data = temp_response.json()
    land_items = land_data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
    temp_items = temp_data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
    
    forecast_info = []
    
    # 육상 예보 데이터 추가 (강수 확률, 하늘 상태)
    for item in land_items:
        for i in range(3, 11):
            rain_prob_am = item.get(f'rnSt{i}Am') if i <= 7 else item.get(f'rnSt{i}')
            rain_prob_pm = item.get(f'rnSt{i}Pm') if i <= 7 else item.get(f'rnSt{i}')
            sky_am = item.get(f'wf{i}Am') if i <= 7 else item.get(f'wf{i}')
            sky_pm = item.get(f'wf{i}Pm') if i <= 7 else item.get(f'wf{i}')
            forecast_date = (current_time_kst + timedelta(days=i)).strftime('%Y-%m-%d')
            forecast_entry = next((entry for entry in forecast_info if entry['날짜'] == forecast_date), None)
            if not forecast_entry:
                forecast_entry = {'날짜': forecast_date}
                forecast_info.append(forecast_entry)
            if rain_prob_am or rain_prob_pm:
                forecast_entry['강수확률'] = f"오전: {rain_prob_am}% / 오후: {rain_prob_pm}%" if rain_prob_am and rain_prob_pm else f"오전: {rain_prob_am}%" if rain_prob_am else f"오후: {rain_prob_pm}%"
            if sky_am or sky_pm:
                forecast_entry['하늘상태'] = f"오전: {sky_am} / 오후: {sky_pm}" if sky_am and sky_pm else f"오전: {sky_am}" if sky_am else f"오후: {sky_pm}"
    
    # 기온 예보 데이터 추가 (최고/최저 기온)
    for item in temp_items:
        for i in range(3, 11):
            min_temp = item.get(f'taMin{i}')
            max_temp = item.get(f'taMax{i}')
            forecast_date = (current_time_kst + timedelta(days=i)).strftime('%Y-%m-%d')
            forecast_entry = next((entry for entry in forecast_info if entry['날짜'] == forecast_date), None)
            if not forecast_entry:
                forecast_entry = {'날짜': forecast_date}
                forecast_info.append(forecast_entry)
            if min_temp:
                forecast_entry['최저기온'] = f"{min_temp}°C"
            if max_temp:
                forecast_entry['최고기온'] = f"{max_temp}°C"
    
    # JSON 저장
    output_path = os.path.join(os.path.dirname(__file__), 'kor_gunsan_longdays.json')
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(forecast_info, json_file, ensure_ascii=False, indent=4)
    
    # TypeScript 파일 저장
    ts_output_path = os.path.join(os.path.dirname(__file__), 'kmaLongTerm.ts')
    with open(ts_output_path, 'w', encoding='utf-8') as ts_file:
        ts_file.write("export interface KMALongTermEntry {\n")
        ts_file.write('  "날짜": string;\n')
        ts_file.write('  "강수확률"?: string;\n')
        ts_file.write('  "하늘상태"?: string;\n')
        ts_file.write('  "최저기온"?: string;\n')
        ts_file.write('  "최고기온"?: string;\n')
        ts_file.write("}\n\n")
        
        ts_file.write("export const kmaLongTermData: KMALongTermEntry[] = ")
        json.dump(forecast_info, ts_file, ensure_ascii=False, indent=2)
        ts_file.write(";\n\n")
        
        ts_file.write("export async function initializeKMALongTermData() {\n")
        ts_file.write("  // This function can be used to fetch data dynamically if needed\n")
        ts_file.write("  // For now, it's not necessary as we're using the static data above\n")
        ts_file.write("}\n")
    
    print(f"TypeScript 데이터가 '{ts_output_path}'에 저장되었습니다.")

except ValueError as e:
    print(f"Failed to parse JSON: {e}")
