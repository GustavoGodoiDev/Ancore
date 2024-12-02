const { contextBridge, ipcRenderer } = require('electron');

// Expondo APIs seguras para o processo de renderização
contextBridge.exposeInMainWorld('electron', {
  sendLoginData: (data) => ipcRenderer.send('login', data),
  onLoginResponse: (callback) => ipcRenderer.on('login-response', callback),
  navigateToCreateAccount: () => ipcRenderer.send('navigate-to-create-account')
});
