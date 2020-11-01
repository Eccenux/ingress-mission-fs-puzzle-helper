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

/* global angular */

/**
 * Angular helper.
 * 
 * AngularJS 1.2 compat.
 */
// eslint-disable-next-line no-unused-vars
class AngularHelper {
	/**
	 * Wait for Angular scope initialization.
	 * 
	 * @param {String} selector Element selector.
	 * @param {Function} callback Function to call when Angular scope is ready.
	 */
	static waitForScope(selector, callback) {
		let checkInterval = 500;
		let intervalId = setInterval(() => {
			// console.log('waitForScope:', selector);
			var viewsContainer = document.querySelector(selector);
			let scope = angular.element(viewsContainer).scope();
			if (scope) {
				// console.log('waitForScope done');
				clearInterval(intervalId);
				callback(scope);
			}
		}, checkInterval);
	}
}
/* global angular AngularHelper */

/**
 * Main plugin class.
 */
// eslint-disable-next-line no-unused-vars
class MyPlugin {
	constructor(codeName) {
		this.codeName = codeName;
		this.playerName = '';
	}

	setup() {
		console.log('MyPlugin setup', this.codeName);

		this.setupPlayer();

		AngularHelper.waitForScope('body > .container', (scope) => {
			this.setupViews(scope);
		});
	}

	/**
	 * When portal was selected.
	 * @param {Object} portal Selected portal POI data.
	 */
	onSelectedPortal(portal) {
		console.log(this.codeName, 'onSelectedPortal', portal);
		console.log(portal.title, this.playerName, portal.location.latitude, portal.location.longitude);
	}

	/**
	 * Hook into view scope.
	 * @param {Object} scope Angular scope.
	 */
	setupViews(scope) {
		console.log(this.codeName, 'setupViews', scope.setSelectedWaypoint);
		var previous = scope.setSelectedWaypoint;
		scope.setSelectedWaypoint = (waypoint, d) => {
			//console.log(this.codeName, 'hacked setSelectedWaypoint', {waypoint, d});
			if (waypoint && waypoint.poi_type && waypoint.poi_type == "PORTAL") {
				this.onSelectedPortal(waypoint._poi);
			}
			previous.call(scope, waypoint, d);
		};
	}

	/**
	 * Setup player data.
	 */
	setupPlayer() {
		try {
			let scope = angular.element(document.body).scope();
			this.playerName = scope.user.nickname;
		} catch (e) {
			console.warn(this.codeName, 'Unable to setup player.', e.message);
		}
	}
}
/* eslint-disable no-undef */

// WARNING!!! Change `missionFsPuzzleHelper` to a unique code name of the plugin.

let myPlugin = new MyPlugin('missionFsPuzzleHelper');

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//use own namespace for plugin
window.plugin.missionFsPuzzleHelper = myPlugin;

window.plugin.missionFsPuzzleHelper.setup();