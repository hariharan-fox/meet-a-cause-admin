# ConnectSphere - Admin Portal

ConnectSphere is a modern, feature-rich administrative suite designed to manage volunteers and NGOs. This portal is built to work seamlessly with a shared Firebase backend, providing real-time moderation and analytics.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React, Tailwind CSS, ShadCN UI
- **Generative AI:** Genkit (Google AI)
- **Backend:** Firebase (Auth & Firestore)
- **Icons:** Lucide React

---

## Getting Started

### 1. Prerequisites
- Node.js v18 or later
- A GitHub account
- Firebase CLI (optional, but recommended for local testing)

### 2. Environment Setup
Create a `.env` file in the root and add your Gemini API Key:
```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Running the App
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:9002`.

---

## Pushing to GitHub

To push your project to GitHub, follow these steps in your local terminal:

1. **Initialize Git (if not already done):**
   ```bash
   git init
   ```

2. **Add all files:**
   ```bash
   git add .
   ```

3. **Commit your changes:**
   ```bash
   git commit -m "Finalized ConnectSphere Admin Portal with Firebase integration"
   ```

4. **Create a new repository on GitHub** and then link it:
   ```bash
   git remote add origin https://github.com/your-username/connectsphere-admin.git
   ```

5. **Push to the main branch:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## Deployment

This app is configured for **Firebase App Hosting**. 
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `studio-9823971235-a7e78`.
3. Navigate to **App Hosting** and connect your GitHub repository.
4. Firebase will automatically build and deploy your Next.js app on every push to the `main` branch.

---

## Key Features

- **NGO Management:** Real-time verification and moderation of organization profiles.
- **Event Moderation:** Review, approve, and manage volunteering opportunities.
- **Volunteer Registry:** View impact history, badges, and activity logs.
- **Analytics Dashboard:** Monitor platform growth and community impact through interactive charts.
- **Badge Configuration:** Manage the gamification rules and visual styles for achievements.
