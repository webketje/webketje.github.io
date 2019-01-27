var path = require('path');

module.exports = function categories(data, prop) {
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