const express = require('express');
const path = require('path');

const version = require('../utilities/version');

const day = 86400000;
const week = day * 7;

module.exports = (app) => {
	// stylesheets
  app.use(`${version}/stylesheets`, express.static(path.join(__dirname, 'styles'), { maxAge: week + 1 }));

  // images
  app.use(`${version}/images`, express.static(path.join(__dirname, 'images'), { maxAge: week + 1 }));

  // javascripts
  app.use(`${version}/javascripts`, express.static(path.join(__dirname, 'js-output'), { maxAge: week + 1 }));
}
