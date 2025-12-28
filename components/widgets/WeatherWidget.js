'use client';
import { useState, useEffect } from 'react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState('Loading Loc...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // 1. Get Weather Data (Open-Meteo - Free, No Key)
                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
                    );
                    const weatherData = await weatherRes.json();

                    // 2. Get Location Name (BigDataCloud - Free, No Key for client side basic usage often works, or use OpenMeteo Geocoding)
                    // Actually, Open-Meteo has a geocoding API too!
                    // But for reverse geocoding from lat/long, BigDataCloud is popular free option. 
                    // Let's try a simple reverse geocode or just show "My Location" if it fails.
                    const geoRes = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const geoData = await geoRes.json();

                    if (weatherData && weatherData.current) {
                        setWeather(weatherData.current);
                        setLocationName(geoData.city || geoData.locality || 'Unknown Location');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Failed to fetch data');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error(err);
                setError('Location access denied');
                setLoading(false);
            }
        );
    }, []);

    // WMO Weather Codes mapping
    const getWeatherIcon = (code) => {
        if (code === 0) return 'fa-sun'; // Clear
        if (code >= 1 && code <= 3) return 'fa-cloud-sun'; // Partly cloudy
        if (code >= 45 && code <= 48) return 'fa-smog'; // Fog
        if (code >= 51 && code <= 67) return 'fa-cloud-rain'; // Drizzle/Rain
        if (code >= 71 && code <= 77) return 'fa-snowflake'; // Snow
        if (code >= 80 && code <= 82) return 'fa-cloud-showers-heavy'; // Showers
        if (code >= 95 && code <= 99) return 'fa-bolt'; // Thunderstorm
        return 'fa-cloud';
    };

    if (loading) return (
        <article className="bento-card weather-widget glass-panel">
            <div className="loading-spinner">Getting Forecast...</div>
        </article>
    );

    if (error) return (
        <article className="bento-card weather-widget glass-panel">
            <div className="error-msg"><i className="fa-solid fa-triangle-exclamation"></i> {error}</div>
        </article>
    );

    return (
        <article className="bento-card weather-widget glass-panel">
            <div className="weather-header">
                <h3><i className="fa-solid fa-location-dot"></i> {locationName}</h3>
                <span className="live-badge">LIVE</span>
            </div>

            <div className="weather-content">
                <div className="current-temp">
                    <i className={`fa-solid ${getWeatherIcon(weather.weather_code)} weather-icon`}></i>
                    <span className="temp-value">{Math.round(weather.temperature_2m)}°C</span>
                </div>
                <div className="weather-details">
                    <div className="detail-item">
                        <i className="fa-solid fa-droplet"></i>
                        <span>{weather.relative_humidity_2m}%</span>
                    </div>
                    <div className="detail-item">
                        <i className="fa-solid fa-wind"></i>
                        <span>{weather.wind_speed_10m} km/h</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .weather-widget {
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0));
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .weather-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .weather-header h3 {
                    font-size: 1rem;
                    color: var(--text-muted);
                    font-weight: 500;
                    margin: 0;
                }
                .live-badge {
                    font-size: 0.6rem;
                    background: var(--neon-cyan);
                    color: black;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 800;
                    animation: pulse 2s infinite;
                }
                .weather-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .current-temp {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .weather-icon {
                    font-size: 2.5rem;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
                    color: var(--text-main);
                }
                .temp-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .weather-details {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                .loading-spinner, .error-msg {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                }
            `}</style>
        </article>
    );
}
