# AI Panchayat

AI Panchayat is a digital village assistant built for rural citizens and Panchayat staff. It provides an intuitive, multilingual interface for accessing government schemes, filing grievances, and requesting documents, all designed with a "Village-first UX" in mind.

## Tech Stack

*   **Frontend & Backend:** [Next.js 14 (App Router)](https://nextjs.org/) for a unified full-stack architecture, enabling seamless deployment of both UI and API routes (like the Gemini AI handler) to Vercel.
*   **Database & Auth:** [Supabase](https://supabase.com/).
*   **State Management & Offline Storage:** [Zustand](https://github.com/pmndrs/zustand) combined with `idb-keyval` (IndexedDB).
*   **Styling:** Vanilla CSS (`globals.css`).
*   **AI Integration:** Managed open-source AI via [Groq](https://groq.com/) using the `llama3-8b-8192` model.
*   **Internationalization:** `next-intl` for English and Hindi support.

## Why Supabase?

Supabase was chosen as the persistence layer for this project for several critical reasons:
1.  **All-in-One Solution:** It provides a PostgreSQL database, a robust Authentication system (GoTrue) supporting phone/OTP logins (crucial for rural users), and object Storage (for uploading grievance photos like broken pipes) all in a single platform.
2.  **Vercel Synergy:** Supabase integrates seamlessly with Vercel, allowing for instant setup of environment variables and easy scaling.
3.  **Row Level Security (RLS):** Built-in PostgreSQL RLS policies ensure that citizens can only see their own requests and grievances, while Panchayat staff can see everything, without writing complex backend authorization logic.

## Village-First UX Principles Applied

*   **Low Bandwidth Optimization:** Removed TailwindCSS and heavy component libraries in favor of a minimal `globals.css` file to keep the initial JavaScript payload tiny, ensuring fast load times on 2G/3G networks.
*   **Offline Tolerance:** Utilized `idb-keyval` to cache the latest Panchayat notices and the user's past requests. A prominent offline banner alerts the user when connectivity drops.
*   **Accessibility:** Implemented large tap targets (minimum 48px), high-contrast primary colors, and simple iconography (`lucide-react`) to aid users with varying levels of digital literacy.
*   **Voice Integration:** Leveraged the native Web Speech API to allow users to interact with the AI assistant via voice, reducing the need for typing in regional languages.

## Setup Instructions

1.  Clone the repository.
2.  Run `npm install`.
3.  Copy `.env.example` to `.env.local` and add your Supabase and Gemini keys.
4.  Run the SQL script located in `database.sql` in your Supabase SQL editor to set up tables and RLS policies.
5.  Start the development server with `npm run dev`.
