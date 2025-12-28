import './globals.css';
import { SettingsProvider } from '@/components/Providers';

export const metadata = {
    title: 'Life OS Dashboard',
    description: 'Your personal all-in-one dashboard',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </body>
        </html>
    )
}
