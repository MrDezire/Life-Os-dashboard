export const dynamic = 'force-dynamic';
import Sidebar from '@/components/Sidebar';
import TaskWidget from '@/components/widgets/TaskWidget';
import HabitWidget from '@/components/widgets/HabitWidget';
import FinanceWidget from '@/components/widgets/FinanceWidget';
import GoalWidget from '@/components/widgets/GoalWidget';
import PomodoroWidget from '@/components/widgets/PomodoroWidget';
import NotesWidget from '@/components/widgets/NotesWidget';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import MusicWidget from '@/components/widgets/MusicWidget';
import QuoteWidget from '@/components/widgets/QuoteWidget';
import { currentUser } from '@clerk/nextjs/server';

export default async function Home() {
    const user = await currentUser();

    if (!user) {
        // middleware handles this usually, but safe fallback
        return null;
    }

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header className="header-section">
                    <div className="greeting-container">
                        <h1 className="greeting">Welcome back, <span>{user.firstName || user.username}</span></h1>
                        <h2 className="sub-greeting">Ready to conquer the day?</h2>
                    </div>
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
