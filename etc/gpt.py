# from g4f.client import Client


# client = Client()
# response = client.chat.completions.create(
#     model="gpt-3.5-turbo",
#     messages=[{"role": "user", 
#                "content": "Привет! Я тебе скину данные по погоде города Алматы, Казахстан и ты дай рекомендации по погоде: "}],
#     # stream=True
# )
# print(response.choices[0].message.content)

import g4f
import requests

url = "http://api.weatherapi.com/v1/current.xml?key=caf9617c6799435eab9123021240505&q=Almaty&aqi=yes"
response = requests.get(url)
response.raise_for_status()  # Raise an exception for any HTTP error
xml_content = response.text

# Here's the JSON content provided earlier
json_content = """
<?xml version="1.0" encoding="utf-8"?><root><location><name>Almaty</name><region>Almaty City</region><country>Kazakhstan</country><lat>43.25</lat><lon>76.95</lon><tz_id>Asia/Almaty</tz_id><localtime_epoch>1714913868</localtime_epoch><localtime>2024-05-05 17:57</localtime></location><current><last_updated_epoch>1714913100</last_updated_epoch><last_updated>2024-05-05 17:45</last_updated><temp_c>18</temp_c><temp_f>64.4</temp_f><is_day>1</is_day><condition><text>Light rain shower</text><icon>//cdn.weatherapi.com/weather/64x64/day/353.png</icon><code>1240</code></condition><wind_mph>16.1</wind_mph><wind_kph>25.9</wind_kph><wind_degree>250</wind_degree><wind_dir>WSW</wind_dir><pressure_mb>1010</pressure_mb><pressure_in>29.83</pressure_in><precip_mm>0.15</precip_mm><precip_in>0.01</precip_in><humidity>77</humidity><cloud>100</cloud><feelslike_c>18</feelslike_c><feelslike_f>64.4</feelslike_f><vis_km>5</vis_km><vis_miles>3</vis_miles><uv>5</uv><gust_mph>20.6</gust_mph><gust_kph>33.1</gust_kph><air_quality><co>454</co><no2>48.7</no2><o3>70.1</o3><so2>91.6</so2><pm2_5>41.4</pm2_5><pm10>46.4</pm10><us-epa-index>3</us-epa-index><gb-defra-index>4</gb-defra-index></air_quality></current></root>
"""

response = g4f.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", 
               "content": f"Привет! {xml_content} По этим данным дай рекомендации для человека о погоде, и эти рекомендации свои о погоде распиши по пунктам, чтобы я мог легко находить"}],
    stream=True,
)

for m in response:
    print(m, flush=True, end='')
