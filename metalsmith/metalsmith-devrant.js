var path = require('path'),
    fs = require('fs');
var devRant = require('devrant');

module.exports = function devrant (profileName, useCache) {
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
        rant.text = rant.text.replace(new RegExp('( |#)' + t + '\\b', 'gi'), ' <strong>' + t + '</strong>');
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