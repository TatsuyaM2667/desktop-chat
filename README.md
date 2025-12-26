# Desktop-ChatApp

## 概要

このプロジェクトは、Electron と React を使用して構築されたリアルタイムチャットアプリケーションです。ユーザー認証、チャンネルベースのメッセージング、画像アップロードを含むプロフィール管理などの機能を備えています。

## 機能

-   **ユーザー認証:** メール/パスワードまたは Google アカウントを使用してサインイン/サインアップできます (Firebase Authentication)。
-   **リアルタイムチャット:** 異なるチャンネル内でリアルタイムにメッセージを送受信できます。
-   **チャンネル管理:** 新しいチャットチャンネルを作成できます。
-   **プロフィール設定:** 表示名の更新や、Cloudinary を使用したプロフィール写真のアップロードが可能です。
-   **画像共有:** Cloudinary を使用して、チャットメッセージ内で画像を直接送信できます。

## 使用技術

-   **フロントエンド:** React.js  
-   **デスクトップフレームワーク:** Electron
-   **UI ライブラリ:** Material-UI (MUI)
-   **バックエンド/データベース/認証:** Firebase (Firestore, Authentication)
-   **画像ストレージ:** Cloudinary
-   **環境変数管理:** `dotenv`

## セットアップ

プロジェクトをローカルでセットアップするには、以下の手順に従ってください。

### 1. リポジトリのクローン

```bash
git clone <あなたのリポジトリURL>
cd desktop-chat
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Firebase の設定

1.  [Firebase Console](https://console.firebase.google.com/) にアクセスし、新しいプロジェクトを作成します。
2.  **Authentication** (メール/パスワードと Google サインイン) および **Firestore Database** を有効にします。
3.  Firebase プロジェクトの設定で、ウェブアプリの構成情報を見つけます。以下のような形式です。

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

### 4. Cloudinary の設定

1.  [Cloudinary](https://cloudinary.com/) にアクセスし、無料アカウントを作成します。
2.  Cloudinary ダッシュボードから、**Cloud name**、**API Key**、**API Secret** を控えておきます。

### 5. 環境変数

プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下を追加します。

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

**重要:** `YOUR_...` のプレースホルダーを、実際の Firebase および Cloudinary の認証情報に置き換えてください。

### 6. Firebase セキュリティルール

Firebase Console の Firestore Database で、認証されたユーザーが `channels` および `messages` コレクションに読み書きできるようにセキュリティルールを更新します。

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

## アプリケーションの実行

開発モードでアプリケーションを実行するには:

1.  **React アプリのビルド:**

    ```bash
    npm run build
    ```

2.  **Electron アプリの起動:**

    ```bash
    npm run electron-start
    ```

