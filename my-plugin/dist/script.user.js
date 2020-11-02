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
/* global angular AngularHelper Portal */

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
	 * @param {Object} rawPortal Selected portal POI data.
	 */
	onSelectedPortal(rawPortal) {
		console.log(this.codeName, 'onSelectedPortal', rawPortal);
		let portal = new Portal(rawPortal);
		let puzzleData = portal.puzzleData(this.playerName);
		//console.log(portal.title, this.playerName, portal.location.latitude, portal.location.longitude);
		console.log(puzzleData);
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
const baseUrl = 'https://intel.ingress.com/intel';

/**
 * Portal type.
 */
// eslint-disable-next-line no-unused-vars
class Portal {

	/**
	 * 1:1 mapping.
	 * @param {Object} portal Portal as found in e.g. `getClusterDetails` requests.
	 * See example portal below.
	 */
	constructor(portal) {
		// note using explicit names for code completition mostly
		// but this will also clone the object
		this.description = portal.description;
		this.guid = portal.guid;
		this.imageUrl = portal.imageUrl;
		this.isOrnamented = portal.isOrnamented;
		this.isStartPoint = portal.isStartPoint;
		this.location =  {
			latitude: portal.location.latitude,
			longitude: portal.location.longitude
		},
		this.title = portal.title;
		this.type = portal.type;
	}

	/**
	 * Puzzle TSV data.
	 * 
	 * Example (nickname is optional):
	 * `Директорский Дом	eccenux	https://intel.ingress.com/intel?ll=55.922126,37.809053&z=17&pll=55.922126,37.809053`
	 * @param {String} nick Player nickname (use empty string for unknown).
	 */
	puzzleData(nick) {
		let url = this.getUrl();
		return `${this.title}\t${nick}\t${url}`;
	}

	/**
	 * Get portal URL.
	 */
	getUrl() {
		let ll = this.getLatLon();
		return `${baseUrl}?ll=${ll}&z=17&pll=${ll}`;
	}

	/**
	 * Get typical lat-lon combo.
	 */
	getLatLon() {
		return `${this.location.latitude},${this.location.longitude}`;
	}

}



// example portal
/*
{
	"description": "Граффити на теплоподстанции",
	"guid": "a8eb1461df3c4ea98fe273c4a170b46b.16",
	"imageUrl": "http://lh3.googleusercontent.com/TkPhLdE3u5q2vn_DipaS0uVTfU3VgV4S3ETKVdTVc_gKII7S0COeEsJv_DDyu_YOeJTbqPtKmmNzIxWj4UWWsdLDLArU",
	"isOrnamented": false,
	"isStartPoint": false,
	"location": {
		"latitude": 55.929404,
		"longitude": 37.801524
	},
	"title": "Граффити \"Космос\"",
	"type": "PORTAL"
}
*/

//module.exports = Portal;
/* eslint-disable no-undef */

// WARNING!!! Change `missionFsPuzzleHelper` to a unique code name of the plugin.

let myPlugin = new MyPlugin('missionFsPuzzleHelper');

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//use own namespace for plugin
window.plugin.missionFsPuzzleHelper = myPlugin;

window.plugin.missionFsPuzzleHelper.setup();