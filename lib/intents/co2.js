var api = require('../util/netatmo');

module.exports = function (app) {
  app.intent('AskCarbonDioxide',
    {
      'slots': { 'LOCATION': 'LOCATION' },
      'utterances': ['{what\'s|what is} the carbon dioxide {in|in the|} {-|LOCATION}']
    },
    function (request, response) {
      var location = request.slot('LOCATION');
      if (typeof location === 'undefined' || location === '') {
        location = 'all';
      }
      api.getData(function (data) {
        var msg = '';
        switch (location) {
          case 'inside':
            msg = 'The carbon dioxide level inside is ' + data.co2;
            break;
          case 'outside':
            msg = 'Sorry, I can only tell carbon dioxide levels for indoor monitors.';
            break;
          case 'all':
            msg = 'The carbon dioxide level inside is ' + data.co2 + '.';
            for (var moduleName in data.extraModules) {
              if (data.extraModules.hasOwnProperty(moduleName)) {
                var module = data.extraModules[moduleName];
                if (module.hasOwnProperty('co2')) {
                  msg += 'The level is ' + module.co2 + ' in the ' + module.name + '.';
                }
              }
            }
            break;
          default:
            if (data.extraModules.hasOwnProperty(location)) {
              var locationData = data.extraModules[location];
              msg = 'The carbon dioxide level is ' + locationData.co2 + ' in the ' + locationData.name + '.';
            } else {
              msg = 'Sorry. There\'s no location called ' + location + '.';
            }
        }

        response.say(msg).send();
      });
      return false;
    });
};