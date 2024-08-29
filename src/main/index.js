import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
const path = require('path');
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import Database from 'better-sqlite3';
const dbPath = path.join(__dirname, '../database.db');
console.log('Database path:', dbPath);
const db = new Database(dbPath, { verbose: console.log });

// Crea la tabla si no existe
//revisar para lanzar multiples sentencias en una sola llamada

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER
  );
    
`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS player (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lvl INTEGER,
  max_hp INTEGER,
  hp INTEGER,
  max_mp INTEGER,
  mp INTEGER,
  atk INTEGER,
  def INTEGER,
  spd INTEGER,
  exp INTEGER,
  exp_to_lvl INTEGER,
  gold INTEGER,
  x INTEGER,
  y INTEGER,
  direction INTEGER
  );`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  music_volume INTEGER,
  sfx_volume INTEGER);`).run();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 736,
    show: false,
    titleBarStyle: 'hidden',
    fullscreen: 'true',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Manejo de eventos IPC de la base de datos
ipcMain.handle('insert-user', (event, name, score) => {
  const stmt = db.prepare('INSERT INTO users (name, score) VALUES (?, ?)');
  const info = stmt.run(name, score);
  return { id: info.lastInsertRowid };
});

ipcMain.handle('get-users', () => {
  const stmt = db.prepare('SELECT * FROM users');
  const users = stmt.all();
  return users;
});

ipcMain.handle('get-settings', () => {
  const stmt = db.prepare('SELECT * FROM settings');
  const settings = stmt.get();
  return settings;
});

ipcMain.handle('update-settings', (event, settings) => {
  const { music_volume, sfx_volume } = settings;
  // console.log('update-settings', music_volume, sfx_volume);
  const stmt = db.prepare('UPDATE settings SET music_volume = ?, sfx_volume = ?');
  const info = stmt.run(music_volume, sfx_volume);
  return info;
});

ipcMain.handle('get-player', () => {
  const stmt = db.prepare('SELECT * FROM player where id = 1');
  const player = stmt.get();
  return player;
});

ipcMain.handle('update-player', (event, player) => {
  console.log('update-player', player);
  const { lvl, max_hp, hp, max_mp, mp, atk, def, spd, exp, exp_to_lvl, gold, x, y, map, direction } = player;
  // const stmt = db.prepare(`
  //   UPDATE player 
  //   SET 
  //   lvl = ?, 
  //   max_hp = ?, 
  //   hp = ?, 
  //   max_mp = ?, 
  //   mp = ?, 
  //   atk = ?, 
  //   def = ?, 
  //   spd = ?, 
  //   exp = ?, 
  //   exp_to_lvl = ?, 
  //   gold = ?, 
  //   x = ?, 
  //   y = ?, 
  //   width = ?, 
  //   height = ?, 
  //   speed = ?, 
  //   frameIndex = ?, 
  //   tickCount = ?, 
  //   frameSpeed = ?, 
  //   spriteSheet = ?, 
  //   spriteWidth = ?, 
  //   spriteHeight = ?, 
  //   spriteColumns = ?, 
  //   spriteRows = ?, 
  //   direction = ? 
  //   where id = 1 `);
  const stmt = db.prepare(`
    UPDATE player 
    SET 
    lvl = ?, 
    max_hp = ?, 
    hp = ?, 
    max_mp = ?, 
    mp = ?, 
    atk = ?, 
    def = ?, 
    spd = ?, 
    exp = ?, 
    exp_to_lvl = ?, 
    gold = ?, 
    x = ?, 
    y = ?, 
    direction = ?,
    map = ?
    where id = 1`);
  try {
    const info = stmt.run(
      lvl,
      max_hp,
      hp,
      max_mp,
      mp,
      atk,
      def,
      spd,
      exp,
      exp_to_lvl,
      gold,
      x,
      y,
      direction,
      map
    );
    console.log({ info })
    return info;
  } catch (e) {
    console.log(e);
  }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
