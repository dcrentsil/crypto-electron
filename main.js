const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const ipc = require('electron').ipcMain

let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })

  //building a menu
  var menu = Menu.buildFromTemplate([
      //first label
    {
        label: 'Menu',
        submenu: 
        [
            {
                label: 'Adjust notification Value'
            },
            {type: 'separator'},

            {
                label: 'coinMarketCap',
                click() {
                    shell.openExternal('http://coinmarketcap.com')
                }
            },
            
            {type: 'separator'},
            {
                label: 'Exit',
                click() {
                    app.quit();
                }
            }
        ]
    },
//second label
    {
        label: 'Info',
        submenu: 
        [
            {
                label: 'About'
            },
        ]    
    }
  ])


 
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

//unv is the given name and what we will be lookiung for
//tpv is the name of msg, bind to response ie textfield in add.html file

ipc.on('update-notify-value', function(event, arg){
    win.webContents.send('targetPriceVal', arg)
})
//ipc Main will catch the msg from add.html and send back to index.html for display