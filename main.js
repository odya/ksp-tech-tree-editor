/**
 * Created by odya on 1/18/16.
 */

var app = require('app')
var BrowserWindow = require('browser-window')

app.on('ready', function(){
    var mainWindow = new BrowserWindow({
        /*width: 800,
        height: 600*/
    })
    mainWindow.maximize()
    mainWindow.loadURL('file://' + __dirname + '/app/index.html')
    mainWindow.openDevTools()


    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        app.quit();
    });
    app.mainWindow = mainWindow;
})

function selectDir() {
    dialog.showOpenDialog({ properties: [ 'openDirectory' ]})
}


// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
});