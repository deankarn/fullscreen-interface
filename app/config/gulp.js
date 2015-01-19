  'use strict';
var root = require('path').normalize(__dirname + '/../..');

module.exports = {
    paths: {
        app: {
            root: root,
            server: root + '/server.js',
            test: root + '/test/mocha.js'
        },
        'in': {
            less: root + '/app/less/*.less',
            cs: root + '/app/coffeescript/**/*.coffee',
            js: root + '/app/js/**/*.js',
        },
        out: {
            static: root + '/static/bundled'
        },
        watch: {
            less: root + '/app/less/**/*.{less,css}',
            cs: root + '/app/coffeescript/**/*.coffee',
            js: root + '/app/js/**/*.js',
            app: ['app'] // relative path to the app.server path
        },
        ignore: {
            app: ['app/js',] // relative path to the app.server path
        }
    }
};
