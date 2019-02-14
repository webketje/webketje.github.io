#!/usr/bin/env node

var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var drafts = require('metalsmith-drafts');
var domTransform = require('metalsmith-dom-transform');
var branch = require('metalsmith-branch');
var sitemap = require('metalsmith-sitemap');
var each = require('metalsmith-each');
var serve = require('metalsmith-serve');
var wordcount = require('metalsmith-word-count');
var debugUI = require('metalsmith-debug-ui');
var sass = require('metalsmith-sass');
var slug = require('metalsmith-slug');
var debug = require('metalsmith-debug');
var minifyHTML = require('metalsmith-html-minifier');
var uglify = require('metalsmith-uglify');
var categories = require('./metalsmith/metalsmith-categories');
var devrant = require('./metalsmith/metalsmith-devrant');
var data = require('./metalsmith/metalsmith-data');
var ignore = require('metalsmith-ignore');
var admin = require('metalsmith-ui');

var metalsmith = Metalsmith(__dirname);
var isDev = process.argv[2] === 'serve'

if (isDev) {
  metalsmith.use(admin());
  /* metalsmith.use(serve({
    port: 4000,
    host: 'localhost',
    verbose: true,
  })); */
}

metalsmith
  // specify source directory
  .source('./src')
  // specify destination directory       
  .destination('./dist')
  // clean destination directory
  .clean(true)
  .use(devrant('webketje', isDev ? true : false))
  .use(debug())
  .metadata({
    author: 'Kevin Van Lierde',
    sitename: '\'t Webketje',
    siteurl: "https://webketje.com",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
  })
  .use(sass({ outputDir: 'assets/css/' }))
  .use(data('_data/*.json'))
  .use(drafts())
  .use(markdown())
  .use(wordcount())
  .use(ignore(isDev ? [] : [
    '_drafts/**/*'
  ]))
  .use(categories({
    layout: 'pages/topic.twig',
    category: 'topic',
    contents: Buffer.from('')
  }))
  .use(collections({
    posts: ['posts/**/*']
  }))
  .use(slug({
    patterns: ['**/*.html'],
    lower: true
  }))
  .use(permalinks({
    relative: false,
    linksets: [
      {
        match: { collection: 'posts' },
        pattern: ':category/:title'
      },
      {
        match: { type: 'topic'},
        pattern: ':category/:title'
      }
    ]
  }))
  .use(layouts({
    directory: './src/_layouts',
    default: 'default.twig',
    pattern: '**/*.html'
  }))
  .use(
    ignore([
      '_layouts/**/*',
      '.devrant__cache'
    ])
  )
  .use(uglify())
  .use(minifyHTML())
  .use(sitemap({
    hostname: 'https://webketje.com',
    pattern: ['**/*.html'],
    omitIndex: true,
    changefreq: 'monthly',
    lastmod: new Date()
  }))
 // .use(debugUI.report('Permalinks'))
  .build(function (err) {
    if (err) throw err;
  });

