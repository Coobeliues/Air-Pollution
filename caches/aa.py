# # import openmeteo_requests

# # import requests_cache
# # import pandas as pd
# # from retry_requests import retry

# # # Setup the Open-Meteo API client with cache and retry on error
# # cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
# # retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
# # openmeteo = openmeteo_requests.Client(session = retry_session)

# # # Make sure all required weather variables are listed here
# # # The order of variables in hourly or daily is important to assign them correctly below
# # url = "https://air-quality-api.open-meteo.com/v1/air-quality"
# # params = {
# # 	"latitude": 43.2567,
# # 	"longitude": 76.9286,
# # 	"current": ["pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone"],
# # 	"hourly": ["pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone"],
# # 	"start_date": "2023-01-01",
# # 	"end_date": "2024-05-01"
# # }
# # responses = openmeteo.weather_api(url, params=params)

# # # Process first location. Add a for-loop for multiple locations or weather models
# # response = responses[0]
# # print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
# # print(f"Elevation {response.Elevation()} m asl")
# # print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
# # print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# # # Current values. The order of variables needs to be the same as requested.
# # current = response.Current()
# # current_pm10 = current.Variables(0).Value()
# # current_pm2_5 = current.Variables(1).Value()
# # current_carbon_monoxide = current.Variables(2).Value()
# # current_nitrogen_dioxide = current.Variables(3).Value()
# # current_sulphur_dioxide = current.Variables(4).Value()
# # current_ozone = current.Variables(5).Value()

# # print(f"Current time {current.Time()}")
# # print(f"Current pm10 {current_pm10}")
# # print(f"Current pm2_5 {current_pm2_5}")
# # print(f"Current carbon_monoxide {current_carbon_monoxide}")
# # print(f"Current nitrogen_dioxide {current_nitrogen_dioxide}")
# # print(f"Current sulphur_dioxide {current_sulphur_dioxide}")
# # print(f"Current ozone {current_ozone}")

# # # Process hourly data. The order of variables needs to be the same as requested.
# # hourly = response.Hourly()
# # hourly_pm10 = hourly.Variables(0).ValuesAsNumpy()
# # hourly_pm2_5 = hourly.Variables(1).ValuesAsNumpy()
# # hourly_carbon_monoxide = hourly.Variables(2).ValuesAsNumpy()
# # hourly_nitrogen_dioxide = hourly.Variables(3).ValuesAsNumpy()
# # hourly_sulphur_dioxide = hourly.Variables(4).ValuesAsNumpy()
# # hourly_ozone = hourly.Variables(5).ValuesAsNumpy()

# # hourly_data = {"date": pd.date_range(
# # 	start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
# # 	end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
# # 	freq = pd.Timedelta(seconds = hourly.Interval()),
# # 	inclusive = "left"
# # )}
# # hourly_data["pm10"] = hourly_pm10
# # hourly_data["pm2_5"] = hourly_pm2_5
# # hourly_data["carbon_monoxide"] = hourly_carbon_monoxide
# # hourly_data["nitrogen_dioxide"] = hourly_nitrogen_dioxide
# # hourly_data["sulphur_dioxide"] = hourly_sulphur_dioxide
# # hourly_data["ozone"] = hourly_ozone

# # hourly_dataframe = pd.DataFrame(data = hourly_data)

# # hourly_dataframe.to_csv('Air_quality_data_Almaty_2023-01-01:2024-05-01.csv', index=False)

# import openmeteo_requests

# import requests_cache
# import pandas as pd
# from retry_requests import retry

# # Setup the Open-Meteo API client with cache and retry on error
# cache_session = requests_cache.CachedSession('.cache', expire_after = -1)
# retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
# openmeteo = openmeteo_requests.Client(session = retry_session)

# # Make sure all required weather variables are listed here
# # The order of variables in hourly or daily is important to assign them correctly below
# url = "https://archive-api.open-meteo.com/v1/archive"
# params = {
# 	"latitude": 43.2567,
# 	"longitude": 76.9286,
# 	"start_date": "2023-01-01",
# 	"end_date": "2024-05-01",
# 	"daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_speed_10m_max", "wind_gusts_10m_max"],
# 	"wind_speed_unit": "ms"
# }
# responses = openmeteo.weather_api(url, params=params)

# # Process first location. Add a for-loop for multiple locations or weather models
# response = responses[0]
# print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
# print(f"Elevation {response.Elevation()} m asl")
# print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
# print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# # Process daily data. The order of variables needs to be the same as requested.
# daily = response.Daily()
# daily_temperature_2m_max = daily.Variables(0).ValuesAsNumpy()
# daily_temperature_2m_min = daily.Variables(1).ValuesAsNumpy()
# daily_precipitation_sum = daily.Variables(2).ValuesAsNumpy()
# daily_wind_speed_10m_max = daily.Variables(3).ValuesAsNumpy()
# daily_wind_gusts_10m_max = daily.Variables(4).ValuesAsNumpy()

# daily_data = {"date": pd.date_range(
# 	start = pd.to_datetime(daily.Time(), unit = "s", utc = True),
# 	end = pd.to_datetime(daily.TimeEnd(), unit = "s", utc = True),
# 	freq = pd.Timedelta(seconds = daily.Interval()),
# 	inclusive = "left"
# )}
# daily_data["temperature_2m_max"] = daily_temperature_2m_max
# daily_data["temperature_2m_min"] = daily_temperature_2m_min
# daily_data["precipitation_sum"] = daily_precipitation_sum
# daily_data["wind_speed_10m_max"] = daily_wind_speed_10m_max
# daily_data["wind_gusts_10m_max"] = daily_wind_gusts_10m_max

# daily_dataframe = pd.DataFrame(data = daily_data)
# # Save DataFrame to CSV
# daily_dataframe.to_csv('historical_weather_daily.csv', index=False)

import openmeteo_requests

import requests_cache
import pandas as pd
from retry_requests import retry

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://air-quality-api.open-meteo.com/v1/air-quality"
params = {
	"latitude": 43.2567,
	"longitude": 76.9286,
	"hourly": ["pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone"],
	"start_date": "2022-07-29",
	"end_date": "2024-05-01"
}
responses = openmeteo.weather_api(url, params=params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation {response.Elevation()} m asl")
print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# Process hourly data. The order of variables needs to be the same as requested.
hourly = response.Hourly()
hourly_pm10 = hourly.Variables(0).ValuesAsNumpy()
hourly_pm2_5 = hourly.Variables(1).ValuesAsNumpy()
hourly_carbon_monoxide = hourly.Variables(2).ValuesAsNumpy()
hourly_nitrogen_dioxide = hourly.Variables(3).ValuesAsNumpy()
hourly_sulphur_dioxide = hourly.Variables(4).ValuesAsNumpy()
hourly_ozone = hourly.Variables(5).ValuesAsNumpy()

hourly_data = {"date": pd.date_range(
	start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
	end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = hourly.Interval()),
	inclusive = "left"
)}
hourly_data["pm10"] = hourly_pm10
hourly_data["pm2_5"] = hourly_pm2_5
hourly_data["carbon_monoxide"] = hourly_carbon_monoxide
hourly_data["nitrogen_dioxide"] = hourly_nitrogen_dioxide
hourly_data["sulphur_dioxide"] = hourly_sulphur_dioxide
hourly_data["ozone"] = hourly_ozone

hourly_dataframe = pd.DataFrame(data = hourly_data)



hourly_dataframe.to_csv('air_qulaity_data_2022-07-29:2024-05-01.csv', index=False)

