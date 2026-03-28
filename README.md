# Meet A Cause - Admin Portal

Meet A Cause Admin is a modern, feature-rich administrative suite designed to manage volunteers and NGOs. This portal works seamlessly with a shared Firebase backend, providing real-time moderation and analytics.

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
- Firebase CLI

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

To push your project to your repository, run these commands in your terminal:

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
   git commit -m "Initial commit: Meet A Cause Admin Portal"
   ```

4. **Link to your repository:**
   ```bash
   git remote add origin https://github.com/hariharan-fox/meet-a-cause-admin.git
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
- **Volunteer Registry:** View impact history and activity logs synced from Firestore.
- **Analytics Dashboard:** Monitor platform growth through interactive charts.
- **Badge Configuration:** Manage gamification rules and visual achievement styles.
