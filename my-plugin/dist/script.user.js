// ==UserScript==
// @author      Eccenux
// @name        FS Puzzle helper for Mission Editor
// @id          ingress-mission-fs-puzzle-helper
// @category    Misc
// @namespace   pl.enux.ingress
// @version     0.2.0
// @description [0.2.0] FS Puzzle helper for Mission Editor
// @match       https://missions.ingress.com/edit*
// @grant       none
// ==/UserScript==


class AngularHelper {
	static waitForScope(selector, callback) {
		let checkInterval = 500;
		let intervalId = setInterval(() => {
			var viewsContainer = document.querySelector(selector);
			let scope = angular.element(viewsContainer).scope();
			if (scope) {
				clearInterval(intervalId);
				callback(scope);
			}
		}, checkInterval);
	}
}


const containerId = 'fsPuzzleHelper-container';

const portalHtml = `
	<div id="${containerId}" style="
		display: grid;
		grid-template-columns: max-content auto;
		grid-gap: .5em;
		padding: .5em 1em 0
	">
		<a class="copy" style="
			display: inline-block;
			vertical-align: middle;
			line-height: 30px;
			color: #5afbea;
		">FS puzzle 📋</a>
		<input class="data" type="text" />
	</div>
`;

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

		let el = document.createElement('li');
		el.innerHTML = portalHtml;
		let container = document.querySelector('ul.navbar-nav');
		container.insertBefore(el, container.firstChild);

		this.input = el.querySelector('.data');
		let copyButton = el.querySelector('.copy');
		copyButton.onclick = () => {
			this.copyTextField(this.input);
		};		
	}

	copyTextField(source) {
		if (typeof source === 'string') {
			source = document.querySelector(source);
		}
		source.select();
		document.execCommand("copy");
	}	

	onSelectedPortal(rawPortal) {
		console.log(this.codeName, 'onSelectedPortal', rawPortal);
		let portal = new Portal(rawPortal);
		let puzzleData = portal.puzzleData(this.playerName);
		console.log(puzzleData);
		this.input.value = puzzleData;
	}

	setupViews(scope) {
		console.log(this.codeName, 'setupViews');

		if (typeof scope.setSelectedWaypoint != 'function') {
			console.warn(this.codeName, 'scope.setSelectedWaypoint not a function!');
		}
		var origSetSelected = scope.setSelectedWaypoint;
		scope.setSelectedWaypoint = (waypoint, d) => {
			if (waypoint && waypoint.poi_type && waypoint.poi_type == "PORTAL") {
				this.onSelectedPortal(waypoint._poi);
			}
			origSetSelected.call(scope, waypoint, d);
		};

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

class Portal {

	constructor(portal) {
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

	puzzleData(nick) {
		let url = this.getUrl();
		return `${this.title}\t${nick}\t${url}`;
	}

	getUrl() {
		let ll = this.getLatLon();
		return `${baseUrl}?ll=${ll}&z=17&pll=${ll}`;
	}

	getLatLon() {
		return `${this.location.latitude},${this.location.longitude}`;
	}

}






let myPlugin = new MyPlugin('missionFsPuzzleHelper');

if(typeof window.plugin !== 'function') window.plugin = function() {};

window.plugin.missionFsPuzzleHelper = myPlugin;

window.plugin.missionFsPuzzleHelper.setup();