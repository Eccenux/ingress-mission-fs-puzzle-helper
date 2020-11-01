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
	 * Hook into view scope.
	 * @param {Object} scope Angular scope.
	 */
	setupViews(scope) {
		console.log(this.codeName, 'setupViews', scope, scope.setSelectedWaypoint);
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