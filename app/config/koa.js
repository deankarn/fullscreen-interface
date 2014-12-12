var logger = require('koa-logger');
var koaStatic = require('koa-static');
var errorHandler = require('koa-error');

module.exports = function (app, config)
{
	app.proxy = config.app.proxy;

	if (config.app.env != 'test')
		app.use(logger());

	app.use(errorHandler());
	app.use(koaStatic(config.app.root + '/static'));
};
