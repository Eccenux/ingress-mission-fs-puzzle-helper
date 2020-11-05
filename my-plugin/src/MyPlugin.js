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

		// prepare input
		let el = document.createElement('li');
		this.input = document.createElement('input');
		el.appendChild(this.input);
		let container = document.querySelector('ul.navbar-nav');
		container.insertBefore(el, container.firstChild);
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
		this.input.value = puzzleData;
	}

	/**
	 * Hook into view scope.
	 * @param {Object} scope Angular scope.
	 */
	setupViews(scope) {
		console.log(this.codeName, 'setupViews');

		// select added waypoint
		if (typeof scope.setSelectedWaypoint != 'function') {
			console.warn(this.codeName, 'scope.setSelectedWaypoint not a function!');
		}
		var origSetSelected = scope.setSelectedWaypoint;
		scope.setSelectedWaypoint = (waypoint, d) => {
			//console.log(this.codeName, 'hacked setSelectedWaypoint', {waypoint, d});
			if (waypoint && waypoint.poi_type && waypoint.poi_type == "PORTAL") {
				this.onSelectedPortal(waypoint._poi);
			}
			origSetSelected.call(scope, waypoint, d);
		};

		// select image fo added waypoint
		if (typeof scope.toggleSelectedPOI != 'function') {
			console.warn(this.codeName, 'scope.toggleSelectedPOI not a function!');
		}
		var origToggleSelected = scope.toggleSelectedPOI;
		scope.toggleSelectedPOI = (_poi) => {
			console.log(this.codeName, 'hacked toggleSelectedPOI', {_poi});
			if (_poi && _poi.type && _poi.type == "PORTAL") {
				this.onSelectedPortal(_poi);
			}
			origToggleSelected.call(scope, _poi);
		};
		
		// select POI on map or search results
		if (typeof scope.setSelectedPOI != 'function') {
			console.warn(this.codeName, 'scope.setSelectedPOI not a function!');
		}
		var origsetSelectedPOI = scope.setSelectedPOI;
		scope.setSelectedPOI = (_poi) => {
			console.log(this.codeName, 'hacked setSelectedPOI', {_poi});
			if (_poi && _poi.type && _poi.type == "PORTAL") {
				this.onSelectedPortal(_poi);
			}
			origsetSelectedPOI.call(scope, _poi);
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