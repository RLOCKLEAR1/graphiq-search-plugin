var IS_LOCAL = window.FTB.IS_LOCAL || window.FTB_IS_LOCAL,
	DOMAIN = IS_LOCAL ? 'dw.com' : 'findthebest.com',
	PROTOCOL = IS_LOCAL ? window.location.protocol : 'https:',
	HOST = PROTOCOL + '//www.' + DOMAIN;

module.exports = {
	DOMAIN: DOMAIN,
	PROTOCOL: PROTOCOL,
	HOST: HOST,
	ICON: '//img1.findthebest.com/sites/default/files/4261/media/images/_6326290.png',
	VERSION: 0.1,
	MODE_MODAL: 'modal',
	MODE_SIDEBAR: 'sidebar',
	MODE_CONTAINER: 'container'
};
