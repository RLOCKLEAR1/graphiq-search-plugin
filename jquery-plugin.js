/**
 * jquery-plugin
 *
 * Adds a jquery plugin that allows you to quickly create
 * an widget search instance inside a container element
 */
var Recommender = require('./Recommender');

var jQueryGlobal = window.jQuery;
if (jQueryGlobal && !jQueryGlobal.fn.recommender) {
	jQueryGlobal.fn.recommender = function(options) {

		// Check if an widget search instance already exists for this element
		var recommender = this.data('__recommender');
		
		if (!recommender) {
			// Create a new recommender instance contained in this element
			options = jQueryGlobal.extend(options, {
				mode: 'container',
				container: this
			});
			recommender = new Recommender(options);
			this.data('__recommender', recommender);
		} else {
			recommender.search();
		}

		return this;
	};
}
