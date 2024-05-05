document.addEventListener('DOMContentLoaded', function () {
    // Elements for displaying air quality data
    const iaqiElement = document.getElementById('iaqi');
    const pm25Element = document.getElementById('pm25');
    const pm10Element = document.getElementById('pm10');
    const no2Element = document.getElementById('no2');
    const tempElement = document.getElementById('t');
    const windElement = document.getElementById('w');
    const gptElement = document.getElementById('gpt')

    // Chart canvases
    const pm25ChartCanvas = document.getElementById('pm25Chart');
    const pm10ChartCanvas = document.getElementById('pm10Chart');

    // Chart contexts
    const pm25ChartCtx = pm25ChartCanvas.getContext('2d');
    const pm10ChartCtx = pm10ChartCanvas.getContext('2d');

    // Variables for holding chart instances
    let pm25Chart, pm10Chart;

    // Function to fetch air quality data from the backend API
    async function fetchAirQualityData() {
        try {
            // const response = await fetch('http://localhost:8000/api/air_quality');
            const response = await fetch('https://coobeliues.github.io/api/air_quality');
            
            const data = await response.json();
            updateUI(data);
            updateCharts(data);

        } catch (error) {
            console.error('Error fetching air quality data:', error);
        }
    }
    async function fetchWeather() {
        const gpt_response = await fetch('https://coobeliues.github.io/api/weather_insights');
        const gpt_data = await gpt_response.text();
        updateWeatherInsights(gpt_data);

    }

    
    function updateWeatherInsights(gpt_data) {
        gptElement.textContent = gpt_data;
    }

    // Function to update the UI with air quality data
    function updateUI(data) {
        if ('data' in data && 'iaqi' in data.data && 'pm25' in data.data.iaqi) {
            pm25Element.textContent = data.data.iaqi.pm25.v.toFixed(2);
        } else {
            pm25Element.textContent = 'N/A';
        }
    
        if ('data' in data && 'iaqi' in data.data) {
            iaqiElement.textContent = data.data.aqi;
        } else {
            iaqiElement.textContent = 'N/A';
        }
    
        if ('data' in data && 'iaqi' in data.data && 'pm10' in data.data.iaqi) {
            pm10Element.textContent = data.data.iaqi.pm10.v.toFixed(2);
        } else {
            pm10Element.textContent = 'N/A';
        }
    
        if ('data' in data && 'iaqi' in data.data && 'no2' in data.data.iaqi) {
            no2Element.textContent = data.data.iaqi.no2.v.toFixed(2);
        } else {
            no2Element.textContent = 'N/A';
        }
    
        if ('data' in data && 'iaqi' in data.data && 't' in data.data.iaqi) {
            tempElement.textContent = data.data.iaqi.t.v.toFixed(2);
        } else {
            tempElement.textContent = 'N/A';
        }
    
        if ('data' in data && 'iaqi' in data.data && 'w' in data.data.iaqi) {
            windElement.textContent = data.data.iaqi.w.v.toFixed(2);
        } else {
            windElement.textContent = 'N/A';
        }

        // Update other UI elements similarly
    }

    // Function to update the charts with air quality data
    function updateCharts(data) {
        if ('data' in data && 'forecast' in data.data && 'daily' in data.data.forecast) {
            const forecast = data.data.forecast.daily;
    
            // Format the date labels as "dd.mm.yy"
            const formattedLabels = forecast.pm25.map(entry => {
                const date = new Date(entry.day);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear().toString().substr(-2);
                return `${day}.${month}.${year}`;
            });
    
            const pm25Data = {
                labels: formattedLabels,
                datasets: [{
                    label: 'PM2.5 (µg/m³)',
                    data: forecast.pm25.map(entry => ({
                        x: new Date(entry.day),
                        y: entry.avg,
                        min: entry.min,
                        max: entry.max
                    })),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            };
    
            const pm10Data = {
                labels: formattedLabels,
                datasets: [{
                    label: 'PM10 (µg/m³)',
                    data: forecast.pm10.map(entry => ({
                        x: new Date(entry.day),
                        y: entry.avg,
                        min: entry.min,
                        max: entry.max
                    })),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            };

            // Destroy existing charts before creating new ones
            if (pm25Chart) {
                pm25Chart.destroy();
            }
            if (pm10Chart) {
                pm10Chart.destroy();
            }

            pm25Chart = new Chart(pm25ChartCtx, {
                type: 'line',
                data: pm25Data,
                options: {
                    // Add chart options as needed
                }
            });

            pm10Chart = new Chart(pm10ChartCtx, {
                type: 'line',
                data: pm10Data,
                options: {
                    // Add chart options as needed
                }
            });
        } else {
            console.log('Forecast data not found.');
        }
    }



    // Include the map-related functions
    const mapScript = document.createElement('script');
    mapScript.src = 'map.js';
    document.body.appendChild(mapScript);

    // Call the init() function from the map.js file
    init();

    // Fetch air quality data initially
    fetchAirQualityData();
    fetchWeather();

    // Fetch air quality data every 180 seconds
    setInterval(fetchAirQualityData, 180000);
});

