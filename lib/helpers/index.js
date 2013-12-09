function expose(helpers) {
  for (var method in helpers) {
    exports[method] = helpers[method];
  }
}

expose(require('./tag'));
expose(require('./url'));
