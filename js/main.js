requirejs.config({
  baseUrl: 'js',
  paths: {
    app: 'app/'
  }
});

require([
  'app/Universe/animateWorld'
],function (Animateworld) {});