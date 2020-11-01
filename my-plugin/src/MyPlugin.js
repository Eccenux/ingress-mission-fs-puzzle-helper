/**
 * Main plugin class.
 */
class MyPlugin {
	constructor (codeName) {
		this.codeName = codeName;
	}

	setup() {
		console.log('MyPlugin setup', this.codeName);

		var waypointsContainer = document.querySelector('#waypoints');
		var playerName = document.querySelector('.navbar-login a')?.textContent?.trim();
		console.log(this.codeName, {waypointsContainer, playerName});
	}
}