function expose(helpers) {
  for (var method in helpers) {
    if (helpers.hasOwnProperty(method)) {
      exports[method] = helpers[method];
    }
  }
}

expose(require('./url'));
