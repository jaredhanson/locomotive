function MockController() {
}

MockController.prototype._init = function(app, id) {
  this.__app = app;
  this.__id = id;
}

MockController.prototype._prepare = function(req, res, next) {
  this.req = req;
  this.res = res;
  this.next = next;
}

MockController.prototype._invoke = function(action) {
  this.res.end(this.req.url + ' -> ' + this.__id + '#' + action);
}


module.exports = MockController;
