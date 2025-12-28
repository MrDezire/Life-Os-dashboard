'use client';
import { useState } from 'react';

const STATIONS = {
    // 1. Romantic Hindi
    'Romantic Hindi': { id: 'videoseries?list=PLCB05E03DA939D484', type: 'list' }, // YRF Best of Romance
    'Arijit Romance': { id: 'videoseries?list=PLTKrc3jfCKjQTdPdyMcNWW-ilnib7dHPy', type: 'list' }, // Arijit Best

    // 2. Vibe
    'Bollywood Lofi': { id: 'BddP6PYo2gs', type: 'video' }, // Best of Bollywood Lofi (Video)
    'Study Focus': { id: 'videoseries?list=PLNIOIzEHtNJb6vZyIFTUocImfK54WKfuY', type: 'list' }, // Lofi Study
};

export default function MusicWidget() {
    const [currentSrc, setCurrentSrc] = useState(`https://www.youtube.com/embed/${STATIONS['Romantic Hindi'].id}`);
    const [activeStation, setActiveStation] = useState('Romantic Hindi');

    const playStation = (name) => {
        const station = STATIONS[name];
        if (station) {
            setActiveStation(name);

            let baseUrl = '';
            // Handle different embed types to maximize reliability
            if (station.type === 'search') {
                baseUrl = `https://www.youtube.com/embed?listType=${station.id}`;
            } else {
                baseUrl = `https://www.youtube.com/embed/${station.id}`;
            }

            setCurrentSrc(baseUrl);
        }
    };

    return (
        <article className="bento-card music-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-brands fa-youtube" style={{ color: '#FF0000' }}></i> Music</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activeStation}</span>
            </div>

            <div className="music-categories">
                <div className="button-row">
                    <button onClick={() => playStation('Romantic Hindi')} className={activeStation === 'Romantic Hindi' ? 'active' : ''}>❤️ Hindi</button>
                    <button onClick={() => playStation('Arijit Romance')} className={activeStation === 'Arijit Romance' ? 'active' : ''}>🎤 Arijit</button>
                    <button onClick={() => playStation('Bollywood Lofi')} className={activeStation === 'Bollywood Lofi' ? 'active' : ''}>🌙 Lofi</button>
                    <button onClick={() => playStation('Study Focus')} className={activeStation === 'Study Focus' ? 'active' : ''}>📚 Study</button>
                </div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', borderRadius: '12px', minHeight: '180px', background: '#000', position: 'relative', marginTop: '12px' }}>
                <iframe
                    width="100%"
                    height="100%"
                    src={currentSrc}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen>
                </iframe>
            </div>

            <style jsx>{`
                .music-categories {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .button-row {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap; 
                }
                button {
                    flex: 1;
                    padding: 8px 4px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    white-space: nowrap;
                    transition: all 0.2s;
                    cursor: pointer;
                    text-align: center;
                }
                button:hover {
                    background: rgba(255,255,255,0.15);
                    color: var(--text-main);
                }
                button.active {
                    background: var(--neon-cyan);
                    color: #000;
                    border-color: var(--neon-cyan);
                    font-weight: 700;
                }
            `}</style>
        </article>
    );
}
