#!/usr/bin/env node

var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var drafts = require('metalsmith-drafts');
var highlight = require('metalsmith-code-highlight');
var domTransform = require('metalsmith-dom-transform');
var branch = require('metalsmith-branch');
var sitemap = require('metalsmith-sitemap');
var each = require('metalsmith-each');
var minimatch = require('minimatch');
var serve = require('metalsmith-serve');
var buildinfo = require('metalsmith-build-info');
var updated = require('metalsmith-updated');
var wordcount = require('metalsmith-word-count');
var fs = require('fs');
var path = require('path');
var debugUI = require('metalsmith-debug-ui');
var sass = require('metalsmith-sass');
var slug = require('metalsmith-slug');
var debug = require('metalsmith-debug');
var devRant = require('devrant');
var minifyHTML = require('metalsmith-html-minifier');
var uglify = require('metalsmith-uglify');

function plugin(name, target) {
  eval('var r = function ' + name + '(files, metalsmith, next) { target(files, metalsmith, next); }');
  return r;
}

var omit = function () {
  var args = arguments;
  return function (files, metalsmith, next) {
    var filePaths = Object.keys(files);

    filePaths.forEach(function (filePath) {
      for (var i = 0; i < args.length; i++)
        if (minimatch(filePath, args[i]))
          delete files[filePath];
    });
    next();
  }
};

var pluginHooks = function (instance) {
  var args = arguments;
  instance.use = function (plugin) {
    console.log('Registered plugin ' + plugin.toString().slice(plugin.toString().indexOf('{')));
    instance.plugins.push(plugin);
    return instance;
  }
  return function (files, metalsmith, next) {
    next();
  };
}

var log = function (instance, log) {
  var args = arguments;
  instance.use = function use(plugin) {
    instance.plugins.push(plugin);
    return instance;
  }
  return function (files, metalsmith, next) {
    log && log(plugin.name, files, metalsmith);
    next();
  };
}


var addMetaData = function () {
  var args = arguments;

  return function addMetaData(files, metalsmith, next) {
    var filePaths = Object.keys(files);

    filePaths.forEach(function (filePath) {
      for (var i = 0; i < args.length; i++)
        if (minimatch(filePath, args[i])) {
          var ext = path.extname(filePath),
            name = path.basename(filePath, ext);

          try {
            var contents;

            if (ext === '.js')
              contents = require(filePath.slice(0, -ext.length));
            else {
              if (ext === '.json')
                contents = JSON.parse(fs.readFileSync(path.join(metalsmith.source(), filePath), { encoding: 'utf-8' }));
            }
          } catch (err) {
            throw err;
          }

          var metadata = metalsmith.metadata();
          var extension = { data: metadata.data || {} };
          extension.data[name] = contents;


          Object.assign(metadata, extension);
          delete files[filePath];
        }
    });
    next();
  };
};

var categories = function (data, prop) {
  var prop = prop || 'category',
    d = data || {},
    categories = [];

  return function (files, metalsmith, next) {
    var keys = Object.keys(files);

    keys.forEach(function (key) {
      if (files[key][prop] && !key.match('search')) {
        var cat = categories.find(function (c) {
          return c.name === files[key][prop];
        });
        if (!cat)
          cat = { name: files[key][prop], items: [] };
        cat.items.push(files[key]);

        cat = files[key][prop];
        let p = path.join(d.path || '', cat + '.html');
        
        if (!files[p]) {
          files[p] = Object.assign({}, d, {
            items: [],
            title: cat,
            path: p
          })
          files[p][prop] = data[prop];
        }
        files[p].items.push(files[key]);
      }
    });

    metalsmith.metadata().categories = categories;

    next();
  }
};

var devrant = function (profileName, useCache) {
  var status = 'pending';
  var res;

  var request = require("request");

  function req() {
    return new Promise(function (resolve, reject) {
      request({
        uri: 'https://devrant.com/api/users/1207790?app=3&content=rants&skip=0',
        method: 'GET',
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 3
      }, function (error, response, body) {
        if (error)
          reject(error);
        else
          resolve(body);
      });
    });
  }

  function fetchProfile() {
    return devRant.profile(profileName)
      .then(function (response) {
        status = 'fulfilled';
        res = response;
        return response;
      }).catch(function (err) {
        status = 'rejected';
        console.log(err);
      });
  }

  return function (files, metalsmith, next) {
    var src = metalsmith.source();

    var setCache = function (data) {
      var cache, cachePath = path.join(src, '.devrant__cache');

      try {
        cache = fs.statSync(cachePath);
      } catch (err) {
        cache = null;
      }

      if (!cache) {
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
      }
    };

    var getCache = function () {
      var cache, cachePath = path.join(src, '.devrant__cache');

      try {
        cache = fs.statSync(cachePath);
      } catch (err) {
        cache = null;
      }

      if (cache && cache.isFile()) {
        var contents = fs.readFileSync(cachePath, { encoding: 'utf-8' });
        return JSON.parse(contents);
      }
    }

    var addLinks = function (rant) {
      if (!rant.links) return rant;
      for (var i = rant.links.length; i--;) {
        var l = rant.links[i];
        rant.text = rant.text.slice(0, l.start) + '<a href="' + l.url + '">' + l.title + '</a>' + rant.text.slice(l.end);
      }
    }

    var addBoldTags = function (rant) {
      if (!rant.tags || rant.tags.length === 1) return rant;
      for (var i = rant.tags.length; i--;) {
        var t = rant.tags[i];
        rant.text = rant.text.replace(new RegExp('( | #)' + t + '\\b', 'gi'), ' <strong>' + t + '</strong>');
      }
    };

    var addToMetadata = function (data) {
      var rants = data,
        keypath = 'content.content.rants'.split('.');
      while (keypath.length)
        rants = rants[keypath.shift()];

      rants.forEach(function (rant) {
        addLinks(rant);
        addBoldTags(rant);
        rant.text = rant.text.trim();
      });

      Object.assign(metalsmith.metadata(), { devrant: data });
    };

    var cached = getCache();
    console.log(cached, useCache)
    if (useCache)
      if (cached) {
        addToMetadata(cached);
        next();
      } else
        fetchProfile().then(function (data) {
          addToMetadata(data);
          setCache(data);
          next();
        });
    else
      fetchProfile().then(function (data) {
        addToMetadata(data);
        next();
      });
  };
}

var metalsmith = Metalsmith(__dirname);

if (process.argv[2] === 'serve') {
  metalsmith.use(serve({
    port: 4000,
    host: 'localhost',
    verbose: true,
  }));
}

metalsmith
  // specify source directory
  .source('./src')
  // specify destination directory       
  .destination('./dist')
  // clean destination directory
  .clean(true)
  .use(devrant('webketje', true))
  .use(debug())
  .use(log(metalsmith, function (plugin, files, metalsmith) {
    console.log(metalsmith.metadata())
  }))
  // add metadata (available to all pages)
  .metadata({
    author: 'Kevin Van Lierde',
    sitename: '\'t Webketje',
    siteurl: "https://webketje.com",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
  })
  .use(buildinfo())
  .use(sass({ outputDir: 'assets/css/' }))
  .use(addMetaData('_data/*.json'))
  .use(plugin('wordcount', wordcount()))
  .use(plugin('drafts', drafts()))
  .use(plugin('updated', updated()))
  .use(markdown())            // transpile all md into html
  .use(categories({
    layout: 'pages/topic.twig',
    category: 'topic',
    contents: Buffer.from('')
  }))
  .use(plugin('collections', collections({          // group all blog posts by internally
    posts: ['posts/**/*']
  })))                         // use `collections.posts` in layouts
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
    omit(
      '_layouts/**/*',
    )
  )
  .use(uglify())
  .use(minifyHTML())
  .use(sitemap({
    hostname: 'https://webketje.com',
    pattern: ['**/*.html', '**/*.md'],
    omitIndex: true,
    changefreq: 'monthly',
    lastmod: new Date()
  }))
  .use(debugUI.report('Permalinks'))
  .build(function (err) {      // build process
    if (err) throw err;       // error handling is required
  });

