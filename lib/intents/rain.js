var api = require('../util/netatmo');
var Q = require('q');

module.exports = function(app) {
  app.intent('AskRain',
    {
      'utterances': ['about the rain {level|}']
    },
    function (request, response) {
      var deferred = Q.defer();
      api.getData(function (error, data) {
        var msg;
        if (error) {
          msg = 'Sorry. There was an error retrieving the rain information.';
        } else {
          msg = 'It is currently ' + (data.rain.raining ? '' : 'not') + ' raining. ';
          msg += 'In the last hour there has been ' + data.rain.lastHour + ' ' + data.rain.units +' of rain, ';
          msg += 'and ' + data.rain.lastDay + ' ' + data.rain.units + ' in the last 24 hours';
        }
        deferred.resolve(response.card({
          type: 'Simple',
          title: 'Netatmo Rain',
          content: msg
        }).say(msg));
      });
      return deferred.promise;
    });
};