var api = require('../util/netatmo');

module.exports = function(app) {
  app.intent('AskSound',
    {
      'utterances': ['{what\'s|what is} the sound {level|}']
    },
    function (request, response) {
      api.getData(function (data) {
        var msg = 'The sound level is ' + data.sound + ' decibels';
        response.say(msg).send();
      });
      return false;
    });
};