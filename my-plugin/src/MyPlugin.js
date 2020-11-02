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