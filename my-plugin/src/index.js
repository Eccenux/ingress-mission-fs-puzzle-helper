/* eslint-disable no-undef */

// WARNING!!! Change `missionFsPuzzleHelper` to a unique code name of the plugin.

let myPlugin = new MyPlugin('missionFsPuzzleHelper');

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//use own namespace for plugin
window.plugin.missionFsPuzzleHelper = myPlugin;

//window.plugin.missionFsPuzzleHelper.setup();

console.log('missionFsPuzzleHelper - test', angular, window.angular, unsafeWindow.angular);