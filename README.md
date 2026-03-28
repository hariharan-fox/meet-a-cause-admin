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

## 🚀 Pushing to GitHub (Manual Steps)

To push this code to your repository, open your terminal in the root directory of this project and run these commands:

1. **Initialize Git:**
   ```bash
   git init
   ```

2. **Add your files:**
   ```bash
   git add .
   ```

3. **Commit your changes:**
   ```bash
   git commit -m "Initial commit: Meet A Cause Admin Portal"
   ```

4. **Connect to your repository:**
   *Note: If you get an error saying 'origin' already exists, run `git remote remove origin` first.*
   ```bash
   git remote add origin https://github.com/hariharan-fox/meet-a-cause-admin.git
   ```

5. **Set the branch to 'main':**
   ```bash
   git branch -M main
   ```

6. **Push to GitHub:**
   ```bash
   git push -u origin main
   ```

---

## Troubleshooting Git Errors

### Error: "fatal: 'https://github.com/...' is not a valid branch name"
This error happens if you accidentally tried to use the URL as a branch name in a previous step.
**Solution:** 
1. Run `git remote remove origin` to reset.
2. Carefully follow steps 4, 5, and 6 above. Ensure `main` is used as the branch name, not the URL.

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
