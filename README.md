# Mood to Movement 🧘‍♀️✨

A mobile-first gentle movement app that turns your current mood and stress level into a beginner-friendly 5–10 minute stretch or yoga flow.

## Features

- 🎙️ **Voice Recording & Transcription**: Speak how you're feeling for up to 30 seconds. Your voice is transcribed and used to design an empathetic, tailored flow.
- ✍️ **Text & Focus Options**: Pick a tension area (desk neck, tight lower back, mental burnout, bedtime wind-down) and add your own brief note about your setting.
- 🛋️ **Small-Space Friendly**: 100% beginner-safe moves designed for small spaces (living room, bedroom, chair, or floor) with zero equipment required.
- ⏱️ **Unhurried Pacing**: Clear exercise instructions, technique tips, and breath cues are presented first so you can get comfortable before starting the step timer.
- 🔔 **Gentle Meditation Chime**: Pure synthesized singing bowl bell upon pose completion.
- 🛡️ **Crisis & Distress Detection**: Built-in support resources (e.g. 988 Lifeline) if serious distress is detected.

## Getting Started Locally

### Prerequisites

- Node.js 18+ installed
- A Gemini API Key (free from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mood-to-movement.git
   cd mood-to-movement
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment for Public Access

To let friends or anyone access the app publicly with their own link:

### Option A: Deploy to Render (Recommended & Free)
1. Push this project to a GitHub repository.
2. Sign up at [Render.com](https://render.com).
3. Click **New +** -> **Web Service** -> Connect your GitHub repository.
4. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: your Gemini API key
6. Click **Deploy**. Render gives you a public `.onrender.com` link anyone can visit on their phone or computer!

### Option B: Deploy to Railway
1. Sign up at [Railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Add `GEMINI_API_KEY` in the project Variables tab.
4. Railway will automatically build and assign a public `.up.railway.app` URL.
