from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import uvicorn 

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allowing requests from any origin for simplicity
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Almaty air quality data endpoint
ALMATY_CITY_ID = 'almaty'  # Almaty city ID on WAQI API
WAQI_API_TOKEN = "6022f160d335edf3cabb5b495b6c860eac0cdbc1"

@app.get("/api/air_quality")
async def get_air_quality_data():
    try:
        url = f"https://api.waqi.info/feed/almaty/?token=6022f160d335edf3cabb5b495b6c860eac0cdbc1"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for any HTTP error
        air_quality_data = response.json()
        return air_quality_data
    except requests.RequestException as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
