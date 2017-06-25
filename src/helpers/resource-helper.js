const version = require('../utilities/version');

module.exports.getResourceString = (key, locale) => {
	return key;
}

module.exports.css = (name) => {
	return `<link rel="stylesheet" href="${version}/stylesheets/${name}.css" type="text/css" />`;
}

module.exports.javascript = (name, locale = '') => {
	if (locale !== '') {
		return `<script type="text/javascript" src="${version}/javascripts/${name}-${locale}.js"></script>`;
	}

	return `<script type="text/javascript" src="${version}/javascripts/${name}.js"></script>`;
}