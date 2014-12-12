'use strict';

// Force UTC DateTime to ensure dates are not parsed in the servers locale
// we will do the converting to the users locale
process.env.TZ = 'UTC';

/**
* Dependencies
*/
var koa = require('koa');

/**
* Config
*/
var config = require('./app/config/config');

/**
* Server
*/
var app = module.exports = koa();

require('./app/config/koa')(app, config);

// Start app
if (!module.parent) {
    app.listen(config.app.port);
    console.log('Server started, listening on port: ' + config.app.port);
}
console.log('Environment: ' + config.app.env);
