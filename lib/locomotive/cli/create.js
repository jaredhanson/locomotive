/**
 * Module dependencies.
 */
var program = require('commander')
  , fs = require('fs')
  , mkdirp = require('mkdirp');


/**
 * Create Locomotive application at `path`.
 *
 * @param {String} path
 * @api private
 */
exports = module.exports = function create(path) {
  console.log('creating Locomotive application at : ' + path);
  
  (function createApplication(path) {
    emptyDirectory(path, function(empty) {
      if (empty) {
        createApplicationAt(path);
      } else {
        program.confirm('destination is not empty, continue? ', function(ok) {
          if (ok) {
            process.stdin.destroy();
            createApplicationAt(path);
          } else {
            abort('aborting');
          }
        });
      }
    });
  })(path);
}


var pagesTemplate = [
    'var locomotive = require(\'locomotive\')'
  , '  , Controller = locomotive.Controller;'
  , ''
  , 'var PagesController = new Controller();'
  , ''
  , 'PagesController.main = function() {'
  , '  this.title = \'Locomotive\''
  , '  this.render();'
  , '}'
  , ''
  , 'module.exports = PagesController;'
  , ''
].join('\r\n');

var layoutTemplate = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title>Locomotive</title>'
  , '  </head>'
  , '  <body>'
  , '    <%- body %>'
  , '  </body>'
  , '</html>'
  , ''
].join('\r\n');

var mainTemplate = [
    '<h2>Welcome to <%= title %></h2>'
  , ''
].join('\r\n');

var routesTemplate = [
    'module.exports = function routes() {'
  , '  this.root(\'pages#main\');'
  , '}'
  , ''
].join('\r\n');

var allTemplate = [
    'var express = require(\'express\');'
  , ''
  , 'module.exports = function() {'
  , '  this.set(\'views\', __dirname + \'/../../app/views\');'
  , '  this.set(\'view engine\', \'ejs\');'
  , '  this.use(express.logger());'
  , '  this.use(express.bodyParser());'
  , '  this.use(this.router);'
  , '  this.use(express.static(__dirname + \'/../../public\'));'
  , '}'
  , ''
].join('\r\n');

var developmentTemplate = [
    'var express = require(\'express\');'
  , ''
  , 'module.exports = function() {'
  , '  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));'
  , '}'
  , ''
].join('\r\n');

var productionTemplate = [
    'var express = require(\'express\');'
  , ''
  , 'module.exports = function() {'
  , '  this.use(express.errorHandler());'
  , '}'
  , ''
].join('\r\n');

var initializerTemplate = [
    '// files in this directory will be require()\'ed when the application starts'
  , ''
].join('\r\n');

var packageTemplate = [
    '{'
  , '  "name": "app-name",'
  , '  "version": "0.0.1",'
  , '  "private": true,'
  , '  "dependencies": {'
  , '    "locomotive": ">= 0.1.0",'
  , '    "express": ">= 2.4.7",'
  , '    "ejs": ">= 0.4.3"'
  , '  }'
  , '}'
  , ''
].join('\r\n');


/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */
function createApplicationAt(path) {
  console.log();
  process.on('exit', function(){
    console.log();
    console.log('   dont forget to install dependencies:');
    console.log('   $ cd %s && npm install', path);
    console.log();
  });
  
  mkdir(path, function() {
    mkdir(path + '/app');
    mkdir(path + '/app/controllers', function(){
      write(path + '/app/controllers/pages_controller.js', pagesTemplate);
    });
    mkdir(path + '/app/views', function(){
      write(path + '/app/views/layout.ejs', layoutTemplate);
    });
    mkdir(path + '/app/views/pages', function(){
      write(path + '/app/views/pages/main.html.ejs', mainTemplate);
    });
    
    mkdir(path + '/config', function(){
      write(path + '/config/routes.js', routesTemplate);
    });
    mkdir(path + '/config/environments', function(){
      write(path + '/config/environments/all.js', allTemplate);
      write(path + '/config/environments/development.js', developmentTemplate);
      write(path + '/config/environments/production.js', productionTemplate);
    });
    mkdir(path + '/config/initializers', function(){
      write(path + '/config/initializers/00_generic.js', initializerTemplate);
    });
    
    mkdir(path + '/public');
    write(path + '/package.json', packageTemplate);
  });
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */
function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
  mkdirp(path, 0755, function(err){
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path);
    fn && fn();
  });
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */
function write(path, str) {
  fs.writeFile(path, str);
  console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */
function abort(str) {
  console.error(str);
  process.exit(1);
}
