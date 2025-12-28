'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function CalendarSync({ onSync }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);
    const [accessDetails, setAccessDetails] = useState(null);

    useEffect(() => {
        const savedId = localStorage.getItem('lifeOS_google_client_id');
        if (savedId) setClientId(savedId);
    }, []);

    const initGoogle = () => {
        if (window.google && window.google.accounts) {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
                callback: (tokenResponse) => {
                    setAccessDetails(tokenResponse);
                    fetchEvents(tokenResponse.access_token);
                },
            });
            setTokenClient(client);
        }
    };

    const handleAuth = () => {
        if (!clientId) {
            alert('Please enter a Google Client ID first.');
            setShowSettings(true);
            return;
        }
        if (!tokenClient) initGoogle();

        // Slight delay to ensure init
        setTimeout(() => {
            if (window.google) {
                // Re-init to be safe if content loaded dynamically
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'https://www.googleapis.com/auth/calendar.readonly',
                    callback: (tokenResponse) => {
                        setAccessDetails(tokenResponse);
                        fetchEvents(tokenResponse.access_token);
                    },
                });
                client.requestAccessToken();
            } else {
                alert('Google scripts not loaded yet. Please wait a moment.');
            }
        }, 500);
    };

    const fetchEvents = async (accessToken) => {
        setLoading(true);
        try {
            const now = new Date().toISOString();
            const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=5&singleEvents=true&orderBy=startTime`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await res.json();
            if (data.items) {
                setEvents(data.items);
                // Optionally auto-add to tasks if needed, or just display
                if (onSync) onSync(data.items);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            alert('Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    const saveClientId = (id) => {
        setClientId(id);
        localStorage.setItem('lifeOS_google_client_id', id);
        setShowSettings(false);
    };

    const addToTasks = (event) => {
        // Dispatch custom event or call prop
        const taskText = `📅 ${event.summary} (${new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
        // Create a custom event that TaskWidget listens to, or just prompt user to copy
        // For simplicity, we just copy to clipboard for now or rely on the parent widget logic if passed
        if (onSync) {
            onSync([{ text: taskText, id: Date.now(), completed: false }]);
            alert('Event added to Tasks!');
        } else {
            prompt('Copy this task:', taskText);
        }
    };

    return (
        <div className="calendar-sync-wrapper">
            <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" onLoad={initGoogle} />

            <div className="calendar-header">
                <button
                    className="google-btn"
                    onClick={handleAuth}
                    disabled={loading}
                >
                    <i className="fa-brands fa-google"></i>
                    {loading ? 'Loading...' : 'Sync Calendar'}
                </button>
                <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
                    <i className="fa-solid fa-gear"></i>
                </button>
            </div>

            {showSettings && (
                <div className="client-id-settings glass-panel">
                    <h4>Google API Configuration</h4>
                    <p className="hint">Get a "Client ID" from Google Cloud Console (OAuth 2.0 Client for Web Application).</p>
                    <input
                        type="text"
                        placeholder="Paste Client ID here..."
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                    />
                    <button onClick={() => saveClientId(clientId)}>Save</button>
                </div>
            )}

            {events.length > 0 && (
                <div className="upcoming-events">
                    <h5>Upcoming Events</h5>
                    {events.map(event => (
                        <div key={event.id} className="mini-event" onClick={() => addToTasks(event)}>
                            <span className="event-time">
                                {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="event-title">{event.summary}</span>
                            <i className="fa-solid fa-plus add-icon"></i>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .calendar-sync-wrapper {
                    margin-top: 16px;
                    width: 100%;
                }
                .calendar-header {
                    display: flex;
                    gap: 8px;
                }
                .google-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 8px;
                    background: rgba(66, 133, 244, 0.15);
                    color: #4285f4;
                    border: 1px solid rgba(66, 133, 244, 0.3);
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .google-btn:hover {
                    background: rgba(66, 133, 244, 0.25);
                }
                .settings-btn {
                    width: 36px;
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: var(--text-muted);
                    border-radius: 8px;
                    cursor: pointer;
                }
                .client-id-settings {
                    margin-top: 12px;
                    padding: 12px;
                    background: rgba(0,0,0,0.4);
                }
                .client-id-settings input {
                    width: 100%;
                    padding: 8px;
                    margin: 8px 0;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid var(--glass-border);
                    color: white;
                    border-radius: 4px;
                }
                .hint {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .upcoming-events {
                    margin-top: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .mini-event {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                }
                .mini-event:hover {
                    background: rgba(255,255,255,0.1);
                }
                .event-time {
                    color: var(--neon-cyan);
                    font-weight: 600;
                    font-size: 0.75rem;
                }
                .event-title {
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .add-icon {
                    font-size: 0.7rem;
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
}
