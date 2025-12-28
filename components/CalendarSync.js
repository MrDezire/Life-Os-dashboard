'use client';
import { useState } from 'react';

export default function CalendarSync() {
    const [syncing, setSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);

    const syncCalendar = async () => {
        setSyncing(true);
        try {
            // For now, we'll use a simple approach without OAuth
            // User will need to manually provide their calendar URL or use a public calendar
            const calendarUrl = prompt('Enter your Google Calendar public iCal URL (or leave blank to skip):');

            if (!calendarUrl) {
                alert('Calendar sync requires a public calendar URL. You can make your calendar public in Google Calendar settings.');
                setSyncing(false);
                return;
            }

            const res = await fetch('/api/calendar/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calendarUrl })
            });

            const data = await res.json();

            if (data.success) {
                setLastSync(new Date());
                alert(`Successfully imported ${data.count} events as tasks!`);
            } else {
                alert('Failed to sync calendar: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            console.error(e);
            alert('Error syncing calendar: ' + e.message);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="calendar-sync">
            <button
                onClick={syncCalendar}
                disabled={syncing}
                className="sync-btn"
                title="Import events from Google Calendar"
            >
                <i className={`fa-brands fa-google ${syncing ? 'fa-spin' : ''}`}></i>
                <span>{syncing ? 'Syncing...' : 'Sync Calendar'}</span>
            </button>
            {lastSync && (
                <span className="last-sync">
                    Last synced: {lastSync.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
            )}

            <style jsx>{`
                .calendar-sync {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 12px;
                }
                .sync-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(66, 133, 244, 0.1);
                    border: 1px solid rgba(66, 133, 244, 0.3);
                    color: #4285f4;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.85rem;
                }
                .sync-btn:hover:not(:disabled) {
                    background: rgba(66, 133, 244, 0.2);
                    transform: translateY(-2px);
                }
                .sync-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .last-sync {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
}
