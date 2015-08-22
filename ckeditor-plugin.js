var PLUGIN_NAME = 'graphiq-search-plugin';

var Constants = require('./Constants');

if (window.CKEDITOR) {
	window.CKEDITOR.plugins.add(PLUGIN_NAME, {
		init: function(editor){
			editor.addCommand(PLUGIN_NAME, {
				exec: function(editor){
					if (editor.__graphiq_search) {
						editor.__graphiq_search.show();
					} else {
						// TODO May want to create one with default settings?
						console.log('No Graphiq Search attached to this editor');
					}
				}
			});

			editor.ui.addButton(PLUGIN_NAME, {
				label: 'Graphiq Search',
				icon: Constants.ICON,
				command: PLUGIN_NAME
			});
		}
	});
}
