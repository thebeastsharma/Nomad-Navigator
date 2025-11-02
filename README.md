NOMAD NAVIGATOR

Live Demo

You can view the live, deployed application here:

https://nomad-navigator-1435d.web.app/

A full-stack, serverless travel log application built with React and the Firebase platform. Users can create accounts, log their travels, and track daily entries, expenses, and photos for each trip.

Key Features

Full User Authentication: Secure sign-up and log-in with Email/Password or Google (via Firebase Authentication).
![Nomad Navigator Screenshot](https://github.com/user-attachments/assets/07aa293c-ce3c-404c-833c-437db1061044)

Trip Management: Users can create, read, and delete their travel logs, which are saved securely to their own account.
![Nomad Navigator Screenshot](https://github.com/user-attachments/assets/160923cd-46f3-4540-92be-ef6c6364446e)
Trip Details: A dedicated page for each trip, which includes:

Daily Journaling: Add and view daily notes for each day of the trip.

Expense Tracking: Log daily expenses with currency and categories (Food, Transport, etc.).
![Nomad Navigator Screenshot](https://github.com/user-attachments/assets/b469de9f-2e3b-4067-8f10-489eb0d5e65b)
Photo Gallery: Add photos by URL to create a visual gallery for the trip.

Scalable Backend: Built on a serverless "Backend-as-a-Service" (BaaS) model.

Automated Data Cleanup: A custom Cloud Function automatically deletes all orphaned sub-collections (logs, photos) when a parent trip is deleted.

Theming: Includes a toggle for Light and Dark modes.

Custom UI: Styled with Tailwind CSS and features a custom full-page background.

Tech Stack

Frontend

React (Vite): A fast, modern React framework for the frontend.

Tailwind CSS: For all utility-first styling.

Lucide React: A clean and simple icon library.

Backend & Cloud

Firebase (BaaS): Used as the complete backend platform.

Firestore: A real-time, NoSQL database for storing all user data.

Firebase Authentication: Handles all user sign-in, sign-up, and session management.

Firebase Cloud Functions: Provides serverless backend logic (e.g., for automated data cleanup).

Firebase Hosting: Hosts the deployed, live version of the React application.

GitHub Actions: Provides CI/CD for automatically building and deploying the app on every push to the main branch.

Deployment

This project is configured for automatic deployment. Any commit pushed to the main branch on GitHub will automatically trigger the GitHub Action, which builds the React app and deploys it to Firebase Hosting.