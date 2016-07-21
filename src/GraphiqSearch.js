var Class = require('class.js');
var Constants = require('./Constants');
var EventEmitter = require('events').EventEmitter;
var extend = require('extend');
var modal = require('./modal/modal');
var msg = require('postmessage');
var noop = function(){};

var GraphiqSearch = Class({

	// UI options that will be passed into iframe
	ui: {
		useInsert: false
	},

	///////////////////////////////////////
	// PUBLIC INTERFACE ///////////////////
	///////////////////////////////////////

	init: function(options) {
		options = extend({}, options);

		// Some defaults before we call setters
		this.setMode(Constants.MODE_MODAL);
		this.setText().setTitle().setTags();

		// Call setters for options passed in
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				set.call(this, prop, options[prop]);
			}
		}

		// Support passing in an explicit host (for debugging)
		this.host = options.host || Constants.HOST;

		// Listen for messages from the iframe
		msg.receiveMessage(receiveMessage.bind(this), this.host);
	},

	show: function() {
		if (this.shouldUseModal()) {
			this.showModal();
		} else {
			this.showContainer();
		}

		// For now, show will automatically trigger a search
		// In a future version, we may want to require search() to be called explicitly
		this.search();

		return this;
	},

	getIframeHtml: function() {
		var src = this.host + '/widgets/plugin';

		var params = this.buildQueryString({
			key:               this.key,
			locale:            this.locale,
			client_user_id:    this.userID,
			client_user_email: this.userEmail,
			client:            this.client,
			client_version:    this.clientVersion
		});
		if (params) {
			src += '?' + params;
		}
		return '<iframe id="wsp-iframe" src="'+src+'" frameborder="0" style="width:100%;height:100%;min-height:300px;"></iframe>';
	},

	showModal: function() {
		if (!this.shouldUseModal()) {
			return this;
		}

		var self = this;

		if (!this.modal) {
			this.modal = modal(this.getIframeHtml(), this.getMode());
			this.iframe = document.querySelector('#wsp-iframe');
			this.modal.on('hide', function(){
				self.afterHide();
			});
			this.modal.on('show', function(){
				self.afterShow();
			});
		} else {
			this.modal.show();
		}

		this.afterShow();

		return this;
	},

	showContainer: function() {
		if (!this.iframe && this.container) {
			this.container.innerHTML = this.getIframeHtml();
			this.iframe = document.querySelector('#wsp-iframe');
		}
		this.afterShow();
	},

	afterShow: function() {
		this.isShown = true;
		this.emit('show');
		return this;
	},

	hide: function() {
		if (this.modal) {
			this.modal.hide();
		}
		this.afterHide();
		return this;
	},

	afterHide: function() {
		this.emit('hide');
		this.isShown = false;
		return this;
	},

	search: function(query) {
		// Make sure modal is showing
		if (!this.isShown) {
			this.showModal();
		}

		// Make sure the interface has loaded
		if (!this.isLoaded) {
			this.onLoad = function(){
				this.search(query);
			}.bind(this);
			return this;
		}

		if (query) {
			postMessage.call(this, 'search', {
				text: query
			});
		} else {
			postMessage.call(this, 'search', {
				title: this.title(),
				text: this.text(),
				tags: this.tags()
			});
		}

		return this;
	},

	setKey: function(key) {
		this.key = key;
		return this;
	},

	getKey: function() {
		return this.key;
	},

	setText: function(callback){
		this.text = callback || noop;
		return this;
	},

	getText: function() {
		return this.text;
	},

	setTitle: function(callback){
		this.title = callback || noop;
		return this;
	},

	getTitle: function() {
		return this.title;
	},

	setTags: function(callback){
		this.tags = callback || noop;
		return this;
	},

	getTags: function() {
		return this.tags;
	},

	setMode: function(mode, container) {
		if (mode === Constants.MODE_CONTAINER) {
			if (container) {
				this.setContainer(container);
			}
			this.mode = Constants.MODE_CONTAINER;
		} else if (mode === Constants.MODE_SIDEBAR) {
			this.mode = Constants.MODE_SIDEBAR;
		} else {
			this.mode = Constants.MODE_MODAL;
		}
		if (this.modal) {
			this.modal.setMode(this.mode);
		}
		return this;
	},

	getMode: function() {
		return this.mode || Constants.MODE_MODAL;
	},

	setContainer: function(container) {
		this.container = container;
		return this;
	},

	getContainer: function() {
		return this.container;
	},

	setUserID: function(id) {
		this.userID = id;
		return this;
	},

	getUserID: function() {
		return this.userID;
	},

	setUserEmail: function(email) {
		this.userEmail = email;
		return this;
	},

	getUserEmail: function() {
		return this.userEmail;
	},

	setColor: function(color) {
		if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
			this.color = color;
		}
		return this;
	},

	getColor: function() {
		return this.color;
	},

	setEmbedType: function(type) {
		if (type === 'script' || type === 'iframe' || type === 'wordpress' || type === 'url') {
			this.embedType = type;
		}
		return this;
	},

	getEmbedType: function() {
		return this.embedType || 'script';
	},

	setLocale: function(locale) {
		this.locale = locale;
		return this;
	},

	getLocale: function() {
		return this.locale;
	},

	setClient: function(client) {
		this.client = client;
		return this;
	},

	getClient: function() {
		return this.client;
	},

	setClientVersion: function(clientVersion) {
		this.clientVersion = clientVersion;
		return this;
	},

	getClientVersion: function() {
		return this.clientVersion;
	},

	shouldUseContainer: function() {
		return this.mode === Constants.MODE_CONTAINER && !!this.container;
	},

	shouldUseModal: function() {
		return !this.shouldUseContainer();
	},

	attachEditor: function(editor) {
		editor.__graphiq_search = this;
		this.setText(function(){
			return editor.getData();
		});
		this.on('select', function(result){
			editor.insertHtml('<br/>'+result.code+'<br/>');
		});
		return this;
	},

	setUiOption: function(option, value) {
		this.ui[option] = value;
		// Pass through to instance if already initialized
		if (this.iframe) {
			postOptions.call(this);
		}
	},

	buildQueryString: function(data) {
		var ret = [];
		for (var d in data) {
			if (data.hasOwnProperty(d) && data[d] !== undefined) {
				ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
			}
		}
		return ret.join('&');
	}

});


///////////////////////////////////////
// PUBLIC MIXIN METHODS ///////////////
///////////////////////////////////////

// Events: on/off/emit/etc.
extend(GraphiqSearch.prototype, EventEmitter.prototype);

// Override 'on' to automate certain functionality
GraphiqSearch.prototype._on = GraphiqSearch.prototype.on;
GraphiqSearch.prototype.on = function(name /*, callback, context */) {
	if (name === 'select') {
		this.setUiOption('useInsert', true);
	}
	this._on.apply(this, arguments);
	return this;
};

///////////////////////////////////////
// PRIVATE INSTANCE METHODS ///////////
///////////////////////////////////////

function set(option, value) {
	// Capitalize
	option = option.charAt(0).toUpperCase() + option.slice(1);
	var fn = 'set'+option;
	if (this[fn]) {
		this[fn](value);
	}
}

function postMessage(method, payload) {
	if (!this.iframe) return;
	var message = {
		method: method,
		payload: payload
	};
	msg.postMessage(message, this.host, this.iframe.contentWindow);
}

function receiveMessage(event) {
	var data = event.data;
	if (!data || !data.method) return;
	if (data.method === 'load') {
		this.isLoaded = true;

		// Pass options to iframe
		postOptions.call(this);

		this.onLoad && this.onLoad();
		this.emit('load', data.payload);
	}
	if (data.method === 'select') {
		this.emit('select', data.payload);
		this.hide();
	}
}

/**
 * Pass any options required for the current session into
 * the iframe so they can be used when communicating with
 * the server
 */
function postOptions() {
	postMessage.call(this, 'options', {
		key: this.key,
		color: this.color,
		embedType: this.embedType,
		ui: this.ui
	});
}

///////////////////////////////////////
// PUBLIC CONSTANTS ///////////////////
///////////////////////////////////////

GraphiqSearch.VERSION = Constants.VERSION;
GraphiqSearch.ICON = Constants.ICON;


module.exports = GraphiqSearch;
