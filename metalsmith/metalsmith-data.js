var path = require('path');
var fs = require('fs');
var minimatch = require('minimatch');

module.exports = function () {
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