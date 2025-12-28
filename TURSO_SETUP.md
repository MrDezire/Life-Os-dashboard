# Turso Database Setup Guide

To keep your "Life OS" functional after deploying to Vercel, you need a persistent cloud database. Turso is the best free option.

## 1. Create a Turso Account
1.  Go to [turso.tech](https://turso.tech/) and sign up.
2.  Install the Turso CLI (optional) or use their web dashboard.

## 2. Create a Database
1.  Create a new database named `life-os-db`.
2.  Copy the **Database URL** (starts with `libsql://`).
3.  Generate and copy an **Auth Token**.

## 3. Configure Vercel
In your Vercel project settings, go to **Environment Variables** and add:

| Name | Value |
| :--- | :--- |
| `TURSO_DATABASE_URL` | *Your LibSQL URL* |
| `TURSO_AUTH_TOKEN` | *Your Auth Token* |

## 📦 Migration Done!
Your app is now ready. When you push to GitHub and connect to Vercel, it will use these cloud credentials. Locally (on your computer), it will continue to use the `life-os.db` file automatically if these variables are missing.
