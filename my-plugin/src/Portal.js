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