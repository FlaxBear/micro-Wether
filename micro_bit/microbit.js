bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
    basic.pause(500)
    basic.clearScreen()
})
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
    basic.pause(500)
    basic.clearScreen()
})
bluetooth.startLEDService()
bluetooth.startButtonService()
