// frontend_app.js
import React, { useState, useEffect } from "react";

function App() {
  const [airQualityData, setAirQualityData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAirQualityData(data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-time Air Quality Data</h1>
      <ul>
        <li>PM2.5: {airQualityData.pm2_5}</li>
        <li>PM10: {airQualityData.pm10}</li>
        <li>NO2: {airQualityData.no2}</li>
      </ul>
    </div>
  );
}

export default App;
