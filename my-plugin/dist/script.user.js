// ==UserScript==
// @author      Eccenux
// @name        FS Puzzle helper for Mission Editor
// @id          ingress-mission-fs-puzzle-helper
// @category    Misc
// @namespace   pl.enux.ingress
// @version     0.0.1
// @description [0.0.1] FS Puzzle helper for Mission Editor
// @match       https://missions.ingress.com/edit*
// @grant       none
// ==/UserScript==

/**
 * Main plugin class.
 */
class MyPlugin {
	constructor (codeName) {
		this.codeName = codeName;
	}

	setup() {
		console.log('MyPlugin setup', this.codeName);
	}
}
/* eslint-disable no-undef */

// WARNING!!! Change `missionFsPuzzleHelper` to a unique code name of the plugin.

let myPlugin = new MyPlugin('missionFsPuzzleHelper');

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//use own namespace for plugin
window.plugin.missionFsPuzzleHelper = myPlugin;

//window.plugin.missionFsPuzzleHelper.setup();

console.log('missionFsPuzzleHelper - test', angular, window.angular, unsafeWindow.angular);