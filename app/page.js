// Force rebuild 2
import Sidebar from '@/components/Sidebar';
import ClockWidget from '@/components/widgets/ClockWidget';
import TaskWidget from '@/components/widgets/TaskWidget';
import HabitWidget from '@/components/widgets/HabitWidget';
import FinanceWidget from '@/components/widgets/FinanceWidget';
import GoalWidget from '@/components/widgets/GoalWidget';
import PomodoroWidget from '@/components/widgets/PomodoroWidget';
import NotesWidget from '@/components/widgets/NotesWidget';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import MusicWidget from '@/components/widgets/MusicWidget';
import QuoteWidget from '@/components/widgets/QuoteWidget';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="app-container">
            <Sidebar user={session} />
            <main className="main-content">
                <header className="header-section">
                    <div className="greeting-container">
                        <h1 className="greeting">Welcome back, <span>{session.username}</span></h1>
                        <h2 className="sub-greeting">Ready to conquer the day?</h2>
                    </div>
                    <ClockWidget />
                </header>

                <div className="bento-grid">
                    {/* Main Focus Area */}
                    <div className="span-large">
                        <TaskWidget />
                    </div>

                    {/* Productivity & Habits */}
                    <div className="span-medium">
                        <HabitWidget />
                    </div>

                    {/* Tools */}
                    <PomodoroWidget />
                    <FinanceWidget />

                    {/* Insights & Wellness */}
                    <div className="span-medium">
                        <GoalWidget />
                    </div>

                    <NotesWidget />
                    <WeatherWidget />
                    <MusicWidget />
                    <QuoteWidget />
                </div>

                <div className="watermark">
                    made by Husenabasha 🐼
                </div>
            </main>
        </div>
    );
}
