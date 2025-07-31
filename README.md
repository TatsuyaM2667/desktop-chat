# Desktop Chat App

## Overview

This is a real-time chat application built as a desktop application using Electron and React. It features user authentication, channel-based messaging, and profile management with image uploads.

## Features

- **User Authentication:** Sign in/Sign up using Email/Password or Google Sign-In (Firebase Authentication).
- **Real-time Chat:** Send and receive messages in real-time within different channels.
- **Channel Management:** Create new chat channels.
- **Profile Settings:** Update display name and upload profile pictures using Cloudinary.
- **Image Sharing:** Send images directly in chat messages using Cloudinary.

## Technology Stack

- **Frontend:** React.js
- **Desktop Framework:** Electron
- **UI Library:** Material-UI (MUI)
- **Backend/Database/Authentication:** Firebase (Firestore, Authentication)
- **Image Storage:** Cloudinary
- **Environment Variables:** `dotenv`

## Setup

Follow these steps to set up the project locally.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd desktop-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Enable **Authentication** (Email/Password and Google Sign-In) and **Firestore Database**.
3.  In your Firebase project settings, find your web app's configuration. It will look something like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };
    ```

### 4. Cloudinary Configuration

1.  Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2.  From your Cloudinary dashboard, note down your **Cloud name**, **API Key**, and **API Secret**.

### 5. Environment Variables

Create a `.env` file in the root directory of your project and add the following:

```
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
```

**Important:** Replace `YOUR_...` placeholders with your actual Firebase and Cloudinary credentials.

### 6. Firebase Security Rules

Update your Firestore Security Rules in the Firebase Console to allow read/write access for authenticated users to `channels` and `messages` collections:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /channels/{channelId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;

      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null &&
                     request.resource.data.message is string &&
                     request.resource.data.message.size() > 0 &&
                     request.resource.data.uid == request.auth.uid;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Running the Application

To run the application in development mode:

1.  **Build the React App:**

    ```bash
npm run build
    ```

2.  **Start the Electron App:**

    ```bash
npm run electron-start
    ```

This will open the desktop application window.
