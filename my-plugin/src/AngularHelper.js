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