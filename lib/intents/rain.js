var api = require('../util/netatmo');

module.exports = function(app) {
  app.intent('AskRain',
    {
      'utterances': ['about the rain {level|}']
    },
    function (request, response) {
      api.getData(function (error, data) {
        if (error) {
          response.say('Sorry. There was an error retrieving the rain information.').send();
        } else {
          var msg = 'It is currently ' + (data.rain.raining ? '' : 'not') + ' raining. ';
          msg += 'In the last hour there has been ' + data.rain.lastHour + ' ' + data.rain.units +' of rain, ';
          msg += 'and ' + data.rain.lastDay + ' ' + data.rain.units + ' in the last 24 hours';
          response.say(msg).send();
        }
      });
      return false;
    });
};