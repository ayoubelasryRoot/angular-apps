module.exports = function(config) {
  var appBase    = 'out/';      // transpiled app JS and map files
  var appSrcBase = 'app/';      // app source TS files
  var appAssets  = '/base/app/'; // component assets fetched by Angular's compiler

  var assetsBase = 'assets/';
  var assetsProxy = '/base/assets/';
  // Important : the forward slash is mandatory in this case
  var fontAssets  = '/base/assets/fonts/'; // Where our fonts will be located (karma proxy)
  var htmlAssets  = '/base/assets/html/'; // Where our fonts will be located (karma proxy)
  var cssAssets   = '/base/assets/css/';
  
  // Testing helpers (optional) are conventionally in a folder called `testing`
  var testingBase    = 'testing/'; // transpiled test JS and map files
  var testingSrcBase = 'testing/'; // test source TS files

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],

    plugins: [
        require('karma-mocha'),
        require('karma-mocha-reporter'),
        require('karma-chai'),
        require('karma-firefox-launcher'),
        require('karma-chrome-launcher'),
        require('karma-coverage')
    ],
    
    client: {
      builtPaths: [appBase, testingBase], // add more spec base paths as needed
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    files: [
      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/core-js/client/shim.js',
      'node_modules/reflect-metadata/Reflect.js',
      //'node_modules/phantomjs-polyfill/bind-polyfill.js',


      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/mocha-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      'node_modules/socket.io-client/dist/socket.io.js',
      
      //{ pattern: 'node_modules/sinon/**/*.js', included: false, watched: false },
      //{ pattern: 'node_modules/sinon-chai/**/*.js', included: false, watched: false },
      
      // Everything that is in our local folder assets will be served by our server
      // see proxy section that will rewrite.
      {pattern: assetsBase + 'models/**/*.json',watched:true, included: false},
      {pattern: assetsBase + 'fonts/*.json',watched:true, included: false},
      {pattern: assetsBase + 'image/*.*',watched:true, included: false},
      {pattern: assetsBase + 'html/*.html',watched:true, included: false},
      {pattern: assetsBase + 'css/*.css',watched:true, included: false},
	  
	    // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'systemjs.config.js', included: false, watched: false },
      { pattern: 'systemjs.config.extras.js', included: false, watched: false },
      'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

      // transpiled application & spec code paths loaded via module imports
      { pattern: appBase + '**/*.js', included: false, watched: true },
      { pattern: testingBase + '**/*.js', included: false, watched: true },


      // Asset (HTML & CSS) paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      // { pattern: assetsBase + 'html/*.html', included: false, watched: true },
      // { pattern: assetsBase + 'css/*.css', included: false, watched: true },
      // { pattern: assetsBase + 'image/*.jpg', included: false, watched: true },
      // { pattern: assetsBase + 'image/*.png', included: false, watched: true },

      // The CSS files that will be copied by gulp are in the output folder
      // { pattern: appBase + '**/*.css', included: false, watched: true },      

      // Paths for debugging with source maps in dev tools
      { pattern: appSrcBase + '**/*.ts', included: false, watched: false },
      { pattern: appBase + '**/*.js.map', included: false, watched: false },
      { pattern: testingSrcBase + '**/*.ts', included: false, watched: false },
      { pattern: testingBase + '**/*.js.map', included: false, watched: false}
    ],
    
    // Change if appBase changes
    // Proxied base paths for loading assets
    proxies: {
      // required for component assets fetched by Angular's compiler
      "/app/": appAssets,
      // Any assets in Angular that gets a ressource from '/assets/' will
      // in fact be redirected to another ressource (/base/assets) that is the
      // one that is used by karma when we included the files. (All files are 
      // served by karma in 'base')
      '/assets/': assetsProxy,
      '/assets/html/': htmlAssets,
      '/assets/css/': cssAssets
    },

    exclude: [],
    // Change if appBase changes
    preprocessors: {
        'out/**/!(*spec).js': ['coverage']
    },
    
    reporters: ['mocha','coverage'],

    mochaReporter: {
      maxLogLines: -1
    },
    
    coverageReporter: {
        includeAllSources: true,
        reporters:[
            {type: 'json', subdir: '.', file: 'coverage-final.json'}
        ]
    },
    
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
}