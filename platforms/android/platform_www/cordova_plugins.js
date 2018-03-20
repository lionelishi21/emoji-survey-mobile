cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-kiosk.kioskPlugin",
    "file": "plugins/cordova-plugin-kiosk/kiosk.js",
    "pluginId": "cordova-plugin-kiosk",
    "clobbers": [
      "window.KioskPlugin"
    ]
  },
  {
    "id": "cordova-plugin-network-information.network",
    "file": "plugins/cordova-plugin-network-information/www/network.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "navigator.connection",
      "navigator.network.connection"
    ]
  },
  {
    "id": "cordova-plugin-network-information.Connection",
    "file": "plugins/cordova-plugin-network-information/www/Connection.js",
    "pluginId": "cordova-plugin-network-information",
    "clobbers": [
      "Connection"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-sqlite-2.sqlitePlugin",
    "file": "plugins/cordova-plugin-sqlite-2/dist/sqlite-plugin.js",
    "pluginId": "cordova-plugin-sqlite-2",
    "clobbers": [
      "sqlitePlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-kiosk": "0.2",
  "cordova-plugin-network-information": "2.0.1",
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-sqlite-2": "1.0.4",
  "cordova-plugin-whitelist": "1.3.1"
};
// BOTTOM OF METADATA
});