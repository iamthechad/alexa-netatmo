var api = require('../util/netatmo');
var Q = require('q');

module.exports = function(app) {
  app.intent('AskSound',
    {
      'utterances': ['{what\'s|what is} the sound {level|}']
    },
    function (request, response) {
      var deferred = Q.defer();
      api.getData(function (error, data) {
        var msg;
        if (error) {
          msg = 'Sorry. There was an error retrieving the sound level.';
        } else {
          msg = 'The sound level is ' + data.sound + ' decibels';
        }

        deferred.resolve(response.card({
          type: 'Simple',
          title: 'Netatmo Sound Level',
          content: msg
        }).say(msg));
      });
      return deferred.promise;
    });
};