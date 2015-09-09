var dom = require('../utils/dom');
var tpl = require('./modal.html');
var Constants = require('../Constants');
var EventEmitter = require('events').EventEmitter;
var extend = require('extend');

module.exports = function(content, mode) {
	var self = {};

	// Require CSS lazily since it inserts styles into head
	require('./modal.css');

	// Append modal to DOM
	var tempDiv = document.createElement('div');
	tempDiv.innerHTML = tpl.replace('{content}', content);
	document.getElementsByTagName('body')[0].appendChild(tempDiv.children[0]);

	// Store reference to modal
	var modal = document.getElementsByClassName('wsm-wrap')[0];

	modal.querySelector('.wsm-close').addEventListener('click', function(){
		self.hide();
	});
	modal.querySelector('.wsm-bg').addEventListener('click', function(){
		self.hide();
	});

	self.show = function() {
		modal.style.display = 'block';
		modal.clientLeft; // Repaint
		dom.addClass(modal, 'shown');

		self.emit('show');
	};

	self.hide = function() {
		dom.removeClass(modal, 'shown');
		setTimeout(function(){
			modal.style.display = 'none';
		}, 400);
		self.emit('hide');
	};

	self.destroy = function() {
		modal.parentNode.removeChild(modal);
		self.emit('destroy');
	};

	self.setMode = function(mode) {
		// Set data attribute
		modal.dataset.mode = mode;
	};

	// Events: on/off/emit/etc.
	extend(self, EventEmitter.prototype);

	self.setMode(mode);
	self.show();

	return self;
};
