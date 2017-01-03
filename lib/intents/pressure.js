var api = require('../util/netatmo');

module.exports = function(app) {
  app.intent('AskPressure',
    {
      'utterances': ['{what\'s|what is} the {air|} pressure']
    },
    function (request, response) {
      api.getData(function (error, data) {
        if (error) {
          response.say('Sorry. There was an error retrieving the air pressure.').send();
        } else {
          var msg = 'The air pressure is ' + data.press + ' ' + data.pressUnits;
          response.say(msg).send();
        }
      });
      return false;
    });
};