from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import g4f


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allowing requests from any origin for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/air_quality")
async def get_air_quality_data():
    try:
        url = "https://api.waqi.info/feed/almaty/?token=6022f160d335edf3cabb5b495b6c860eac0cdbc1" #aqi info
        

        response = requests.get(url)
        response.raise_for_status()  
        air_quality_data = response.json()


        return air_quality_data
    except requests.RequestException as e:
        return {"error": str(e)}

@app.get("/api/weather_insights")
async def get_weather_insights_data():
    try:
        url_weather = "http://api.weatherapi.com/v1/current.xml?key=caf9617c6799435eab9123021240505&q=Almaty&aqi=yes" #weather info

        response_w = requests.get(url_weather)
        response_w.raise_for_status()  # Raise an exception for any HTTP error
        xml_content = response_w.text

        response_gpt = g4f.ChatCompletion.create( #gpt model for weather insights
            model="gpt-3.5-turbo", 
            messages=[{"role": "user", 
                    "content": f"Привет! {xml_content} По этим данным дай рекомендации для человека о погоде, и эти рекомендации свои о погоде распиши по пунктам, чтобы я мог легко находить"}],
            stream=True,
        )
        return response_gpt
    except requests.RequestException as e:
        return {"error: str(e)"}