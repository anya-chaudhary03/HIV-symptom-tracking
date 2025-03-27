## HIV Symptom Tracking App

A React Native (Expo) application for tracking daily symptoms and medications. Users can log their health data, view records for specific dates, and manage their medications. 
The app uses Firebase (Firestore) for data storage and authentication, and React Query for data fetching and caching. 

## Prerequisites
- Node.js (LTS or current)
- npm package manager
- Expo CLI (installed globally)
```
npm install --global expo-cli
```
## Installation & Setup
- Clone the repository
- Install dependencies
```
npm install
```
The Firebase configuration file already exists in the project. To secure your Firebase credentials, create a .env file in the project root and define your environment variables. For example:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## Usage
```
npm run start
```

