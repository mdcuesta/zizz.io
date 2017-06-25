const resourceHelper = require('../helpers/resource-helper');
const version = require('../utilities/version');

module.exports = (engine) => {
	engine.helper.getResourceString = resourceHelper.getResourceString;

	engine.helper.css = resourceHelper.css;

	engine.helper.javascript = resourceHelper.javascript;
}