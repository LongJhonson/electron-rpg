import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('database', {
      insertUser: (name, score) => ipcRenderer.invoke('insert-user', name, score),
      getUsers: () => ipcRenderer.invoke('get-users'),
      getSettings: () => ipcRenderer.invoke('get-settings'),
      saveSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
      getPlayer: () => ipcRenderer.invoke('get-player'),
      updatePlayer: (player) => ipcRenderer.invoke('update-player', player)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
