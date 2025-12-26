const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // .envファイルを読み込む

// Cloudinaryの設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPCハンドラー: Cloudinaryへの画像アップロード
ipcMain.handle('upload-to-cloudinary', async (event, filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
});
