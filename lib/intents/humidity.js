var api = require('../util/netatmo');
var Q = require('q');

module.exports = function(app) {
  app.intent('AskHumidity',
    {
      'slots': { 'LOCATION': 'LOCATION' },
      'utterances': ['{what\'s|what is} the humidity {in|in the|} {-|LOCATION}']
    },
    function (request, response) {
      var deferred = Q.defer();
      var location = request.slot('LOCATION');
      if (typeof location === 'undefined' || location === '') {
        location = 'all';
      }
      api.getData(function (error, data) {
        if (error) {
          var errorMsg = 'Sorry. There was an error retrieving the humidity.';
          response.card({
            type: 'Simple',
            title: 'Netatmo Humidity',
            content: errorMsg
          }).say(errorMsg).send();
        } else {
          var msg = '';
          switch (location) {
            case 'inside':
              msg = 'The humidity inside is ' + data.humIn + '%';
              break;
            case 'outside':
              msg = 'The humidity outside is ' + data.humOut + '%';
              break;
            case 'all':
              msg = 'The humidity is ' + data.humIn + '% inside and ' + data.humOut + '% outside';
              break;
            default:
              if (data.extraModules.hasOwnProperty(location)) {
                var locationData = data.extraModules[location];
                msg = 'The humidity is ' + locationData.hum + '% in the ' + location + '.';
              } else {
                msg = 'Sorry. There\'s no location called ' + location + '.';
              }
          }

          return deferred.resolve(response.card({
            type: 'Simple',
            title: 'Netatmo Humidity',
            content: msg
          }).say(msg));
        }
      });
      return deferred.promise;
    });
};