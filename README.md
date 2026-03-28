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

If you encountered errors like **"invalid branch name"**, follow these steps to reset your connection and push correctly. Run these commands in your terminal from the root directory of the project.

1. **Initialize or Reset Git:**
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

4. **Fix Remote Connection (If you already added it incorrectly):**
   ```bash
   git remote remove origin 2>/dev/null
   git remote add origin https://github.com/hariharan-fox/meet-a-cause-admin.git
   ```

5. **Set the branch name to 'main':**
   ```bash
   git branch -M main
   ```

6. **Push to GitHub:**
   ```bash
   git push -u origin main
   ```

### Troubleshooting Git Errors

- **Error: "fatal: 'https://github.com/...' is not a valid branch name"**:
  - This happens if you accidentally tried to use the URL as a branch name. 
  - **Solution:** Follow the steps above exactly, especially step 4 and 5. Ensure you are pushing `main` to `origin`.

---

## Deployment

This app is configured for **Firebase App Hosting**. 
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `studio-9823971235-a7e78`.
3. Navigate to **App Hosting** and connect your GitHub repository `hariharan-fox/meet-a-cause-admin`.
4. Firebase will automatically build and deploy your Next.js app on every push to the `main` branch.

---

## Key Features

- **NGO Management:** Real-time verification and moderation of organization profiles.
- **Event Moderation:** Review, approve, and manage volunteering opportunities.
- **Volunteer Registry:** View impact history and activity logs synced from Firestore.
- **Analytics Dashboard:** Monitor platform growth through interactive charts.
- **Badge Configuration:** Manage gamification rules and visual achievement styles.
