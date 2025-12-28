'use client';
import { useState, useEffect, useRef } from 'react';

export default function PomodoroWidget() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [sessions, setSessions] = useState(0);
    const audioRef = useRef(null);

    const workDuration = 25 * 60;
    const breakDuration = 5 * 60;
    const totalTime = isBreak ? breakDuration : workDuration;
    const currentTime = minutes * 60 + seconds;
    const progress = ((totalTime - currentTime) / totalTime) * 100;

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // Timer finished
                        if (audioRef.current) audioRef.current.play();
                        if (isBreak) {
                            setIsBreak(false);
                            setMinutes(25);
                        } else {
                            setSessions(s => s + 1);
                            setIsBreak(true);
                            setMinutes(5);
                        }
                        setSeconds(0);
                        setIsActive(false);
                    } else {
                        setMinutes(m => m - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(s => s - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, isBreak]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setMinutes(isBreak ? 5 : 25);
        setSeconds(0);
    };

    return (
        <article className="bento-card pomodoro-widget glass-panel">
            <div className="card-header">
                <h3><i className="fa-solid fa-clock"></i> Focus Timer</h3>
                <span className="session-count">{sessions} sessions</span>
            </div>

            <div className="timer-container">
                <svg className="progress-ring" width="140" height="140">
                    <circle
                        className="progress-ring-bg"
                        cx="70"
                        cy="70"
                        r="60"
                    />
                    <circle
                        className="progress-ring-fill"
                        cx="70"
                        cy="70"
                        r="60"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 60}`,
                            strokeDashoffset: `${2 * Math.PI * 60 * (1 - progress / 100)}`
                        }}
                    />
                </svg>
                <div className="timer-display">
                    <div className="time">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</div>
                    <div className="mode">{isBreak ? 'Break' : 'Focus'}</div>
                </div>
            </div>

            <div className="timer-controls">
                <button onClick={toggle} className="control-btn primary">
                    <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button onClick={reset} className="control-btn">
                    <i className="fa-solid fa-rotate-right"></i>
                </button>
            </div>

            <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=" />

            <style jsx>{`
                .pomodoro-widget {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                }
                .session-count {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    background: rgba(0, 243, 255, 0.1);
                    padding: 4px 8px;
                    border-radius: 12px;
                }
                .timer-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                }
                .progress-ring {
                    transform: rotate(-90deg);
                }
                .progress-ring-bg {
                    fill: none;
                    stroke: rgba(255, 255, 255, 0.1);
                    stroke-width: 8;
                }
                .progress-ring-fill {
                    fill: none;
                    stroke: var(--neon-cyan);
                    stroke-width: 8;
                    stroke-linecap: round;
                    transition: stroke-dashoffset 0.3s;
                    filter: drop-shadow(0 0 8px var(--neon-cyan));
                }
                .timer-display {
                    position: absolute;
                    text-align: center;
                }
                .time {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-main);
                    font-variant-numeric: tabular-nums;
                }
                .mode {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .timer-controls {
                    display: flex;
                    gap: 12px;
                }
                .control-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .control-btn.primary {
                    background: var(--neon-cyan);
                    color: #000;
                    border-color: var(--neon-cyan);
                    box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
                }
                .control-btn:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </article>
    );
}
