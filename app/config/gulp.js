  'use strict';
var root = require('path').normalize(__dirname + '/../..');

module.exports = {
    paths: {
        'in': {
            less: root + '/app/less/*.less',
            cs: root + '/app/coffeescript/**/*.coffee'
        },
        out: {
            static: root + '/static/bundled'
        },
        watch: {
            less: root + '/app/less/**/*.{less,css}',
            cs: root + '/app/coffeescript/**/*.coffee',
            app: [root + '/server.js', root + '/app/**/*.js']
        }
    }
};
