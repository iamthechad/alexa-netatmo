var api = require('../util/netatmo');
var Q = require('q');

module.exports = function(app) {
  app.intent('AskPressure',
    {
      'utterances': ['{what\'s|what is} the {air|} pressure']
    },
    function (request, response) {
      var deferred = Q.defer();
      api.getData(function (error, data) {
        var msg;
        if (error) {
          msg = 'Sorry. There was an error retrieving the air pressure.';
        } else {
          msg = 'The air pressure is ' + data.press + ' ' + data.pressUnits;
        }
        deferred.resolve(response.card({
          type: 'Simple',
          title: 'Netatmo Air Pressure',
          content: msg
        }).say(msg));
      });
      return deferred.promise;
    });
};