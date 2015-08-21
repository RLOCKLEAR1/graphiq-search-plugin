var PLUGIN_NAME = 'ftb-plugin';

var Constants = require('./Constants');

if (window.CKEDITOR) {
	window.CKEDITOR.plugins.add(PLUGIN_NAME, {
		init: function(editor){
			editor.addCommand(PLUGIN_NAME, {
				exec: function(editor){
					if (editor.__recommender) {
						editor.__recommender.show();
					} else {
						// TODO May want to create one with default settings?
						console.log('No Recommender attached to this editor');
					}
				}
			});

			editor.ui.addButton(PLUGIN_NAME, {
				label: 'Recommended Content',
				icon: Constants.ICON,
				command: PLUGIN_NAME
			});
		}
	});
}
