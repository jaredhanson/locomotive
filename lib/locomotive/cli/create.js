/**
 * Module dependencies.
 */
var program = require('commander')
  , os = require('os')
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


var eol = 'win32' == os.platform() ? '\r\n' : '\n';

var pagesController = [
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
].join(eol);

var mainTemplate = [
    '<!DOCTYPE html>'
  , '<html>'
  , '  <head>'
  , '    <title><%= title %></title>'
  , '    <link rel="stylesheet" href="/stylesheets/style.css" />'
  , '  </head>'
  , '  <body>'
  , '    <h1><%= title %></h1>'
  , '    <p>Welcome aboard! Visit <a href="http://locomotivejs.org/">locomotivejs.org</a> for details.</p>'
  , '  </body>'
  , '</html>'
].join(eol);

var cssStylesheet = [
    'body {'
  , '  padding: 50px;'
  , '  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;'
  , '}'
  , ''
  , 'a {'
  , '  color: #00B7FF;'
  , '}'
].join(eol);

var routesTemplate = [
    '// Draw routes.  Locomotive\'s router provides expressive syntax for drawing'
  , '// routes, including support for resourceful routes, namespaces, and nesting.'
  , '// MVC routes can be mapped mapped to controllers using convenient'
  , '// `controller#action` shorthand.  Standard middleware in the form of'
  , '// `function(req, res, next)` is also fully supported.  Consult the Locomotive'
  , '// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional'
  , '// information.'
  , 'module.exports = function routes() {'
  , '  this.root(\'pages#main\');'
  , '}'
  , ''
].join(eol);

var allEnvironments = [
    'var express = require(\'express\')'
  , '  , poweredBy = require(\'connect-powered-by\')'
  , '  , util = require(\'util\');'
  , ''
  , 'module.exports = function() {'
  , '  // Warn of version mismatch between global "lcm" binary and local installation'
  , '  // of Locomotive.'
  , '  if (this.version !== require(\'locomotive\').version) {'
  , '    console.warn(util.format(\'version mismatch between local (%s) and global (%s) Locomotive module\', require(\'locomotive\').version, this.version));'
  , '  }'
  , ''
  , '  // Configure application settings.  Consult the Express API Reference for a'
  , '  // list of the available [settings](http://expressjs.com/api.html#app-settings).'
  , '  this.set(\'views\', __dirname + \'/../../app/views\');'
  , '  this.set(\'view engine\', \'ejs\');'
  , ''
  , '  // Register EJS as a template engine.'
  , '  this.engine(\'ejs\', require(\'ejs\').__express);'
  , ''
  , '  // Override default template extension.  By default, Locomotive finds'
  , '  // templates using the `name.format.engine` convention, for example'
  , '  // `index.html.ejs`  For some template engines, such as Jade, that find'
  , '  // layouts using a `layout.engine` notation, this results in mixed conventions'
  , '  // that can cuase confusion.  If this occurs, you can map an explicit'
  , '  // extension to a format.' 
  , '  /* this.format(\'html\', { extension: \'.jade\' }) */'
  , ''
  , '  // Register formats for content negotiation.  Using content negotiation,'
  , '  // different formats can be served as needed by different clients.  For'
  , '  // example, a browser is sent an HTML response, while an API client is sent a'
  , '  // JSON or XML response.'
  , '  /* this.format(\'xml\', { engine: \'xmlb\' }); */'
  , ''
  , '  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)'
  , '  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)'
  , '  // middleware available as separate modules.'
  , '  this.use(poweredBy(\'Locomotive\'));'
  , '  this.use(express.logger());'
  , '  this.use(express.favicon());'
  , '  this.use(express.static(__dirname + \'/../../public\'));'
  , '  this.use(express.bodyParser());'
  , '  this.use(this.router);'
  , '}'
  , ''
].join(eol);

var developmentEnvironment = [
    'var express = require(\'express\');'
  , ''
  , 'module.exports = function() {'
  , '  this.use(express.errorHandler());'
  , '}'
  , ''
].join(eol);

var productionEnvironment = [
    'var express = require(\'express\');'
  , ''
  , 'module.exports = function() {'
  , '}'
  , ''
].join(eol);

var genericInitializer = [
    'module.exports = function() {'
  , '  // Any files in this directory will be `require()`\'ed when the application'
  , '  // starts, and the exported function will be invoked with a `this` context of'
  , '  // the application itself.  Initializers are used to connect to databases and'
  , '  // message queues, and configure sub-systems such as authentication.'
  , ''
  , '  // Async initializers are declared by exporting `function(done) { /*...*/ }`.'
  , '  // `done` is a callback which must be invoked when the initializer is'
  , '  // finished.  Initializers are invoked sequentially, ensuring that the'
  , '  // previous one has completed before the next one executes.'
  , '}'
  , ''
].join(eol);

var mimeInitializer = [
    'module.exports = function() {'
  , '  // Define custom MIME types.  Consult the mime module [documentation](https://github.com/broofa/node-mime)'
  , '  // for additional information.'
  , '  /*'
  , '  this.mime.define({'
  , '    \'application/x-foo\': [\'foo\']'
  , '  });'
  , '  */'
  , '}'
  , ''
].join(eol);

var packageJSON = [
    '{'
  , '  "name": "app-name",'
  , '  "version": "0.0.1",'
  , '  "private": true,'
  , '  "dependencies": {'
  , '    "locomotive": "0.3.x",'
  , '    "express": "3.x.x",'
  , '    "connect-powered-by": "0.1.x",'
  , '    "ejs": "0.8.x"'
  , '  }'
  , '}'
  , ''
].join(eol);


/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */
function createApplicationAt(path) {
  console.log();
  process.on('exit', function(){
    console.log();
    console.log('   install dependencies:');
    console.log('     $ cd %s && npm install', path);
    console.log();
    console.log('   run the app:');
    console.log('     $ lcm server');
    console.log();
  });
  
  mkdir(path, function() {
    mkdir(path + '/app');
    mkdir(path + '/app/controllers', function(){
      write(path + '/app/controllers/pages_controller.js', pagesController);
    });
    mkdir(path + '/app/views');
    mkdir(path + '/app/views/pages', function(){
      write(path + '/app/views/pages/main.html.ejs', mainTemplate);
    });
    
    mkdir(path + '/config', function(){
      write(path + '/config/routes.js', routesTemplate);
    });
    mkdir(path + '/config/environments', function(){
      write(path + '/config/environments/all.js', allEnvironments);
      write(path + '/config/environments/development.js', developmentEnvironment);
      write(path + '/config/environments/production.js', productionEnvironment);
    });
    mkdir(path + '/config/initializers', function(){
      write(path + '/config/initializers/00_generic.js', genericInitializer);
      write(path + '/config/initializers/01_mime.js', mimeInitializer);
    });
    
    mkdir(path + '/public');
    mkdir(path + '/public/stylesheets', function(){
      write(path + '/public/stylesheets/style.css', cssStylesheet);
    });
    
    write(path + '/package.json', packageJSON);
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
