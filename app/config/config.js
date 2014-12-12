'use strict';
var path = require('path');
var _ = require('lodash');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var production = env == 'production' ? true : false;

var base = {
    app: {
        root: path.normalize(__dirname + '/../..'),
        env: env,
        isProduction: production,
        proxy: true
    }
};

var specific = {
    development: {
        app: {
            port: 3000,
            name: 'Fullscreen Interface - Dev'
        }
    },
    test: {
        app: {
            port: 3001,
            name: 'Fullscreen Interface - Test realm'
        }
    },
    production: {
        app: {
            port: process.env.PORT || 3000,
            name: 'Fullscreen Interface'
        }
    }
};

module.exports = _.merge(base, specific[env]);
