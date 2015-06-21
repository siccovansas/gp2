var metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-pandoc');
var templates   = require('metalsmith-templates');
var serve       = require('metalsmith-serve');
var watch       = require('metalsmith-watch');
var moment      = require('moment');
var i18n        = require('i18next');
var headings    = require('metalsmith-headings');
var convert     = require('metalsmith-convert');

//i18n.init({ lng: "fr-FR" });
i18n.init({ lng: "en-US" });
i18n.registerAppHelper(metalsmith);

// Image handling: metalsmith-convert config

var convertConfig = {
    src: '**/*.jpg',
    target: 'jpg',
    resize: {
        width: 320,
        height: 320,
        resizeStyle: 'aspectfit'
    }    
};


metalsmith(__dirname)
    .source('src')
    .use(markdown())
    .use(headings('h2'))
    .use(templates({
        engine: 'jade',
        moment: moment,
        i18n: i18n
    }))
    .use(convert(convertConfig))
    .destination('build')
    .use(serve({
        port: 8081
    }))
    .use(watch({
        paths: {
            "${source}/**/*": true,
            "templates/**/*": "**/*.md",
        }
    }))
    .build(function (err) {
        if (err) {
            throw err;
        }
    });
