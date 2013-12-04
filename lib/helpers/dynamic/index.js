expose(require('./url'));

function expose(helpers) {
  for (var method in helpers) {
    exports[method] = helpers[method];
  }
}
