/**
 * jquery-plugin
 *
 * Adds a jquery plugin that allows you to quickly create
 * an widget search instance inside a container element
 */
var GraphiqSearch = require('./GraphiqSearch');

var jQueryGlobal = window.jQuery;
if (jQueryGlobal && !jQueryGlobal.fn.graphiqSearch) {
	jQueryGlobal.fn.graphiqSearch = function(options) {

		// Check if an widget search instance already exists for this element
		var graphiqSearch = this.data('__graphiq_search');
		
		if (!graphiqSearch) {
			// Create a new search instance contained in this element
			options = jQueryGlobal.extend(options, {
				mode: 'container',
				container: this
			});
			graphiqSearch = new GraphiqSearch(options);
			this.data('__graphiq_search', graphiqSearch);
		} else {
			graphiqSearch.search();
		}

		return this;
	};
}
