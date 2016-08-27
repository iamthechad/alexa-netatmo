var api = require('../util/netatmo');

module.exports = function(app) {
  app.intent('AskPressure',
    {
      'utterances': ['{what\'s|what is} the {air]} pressure']
    },
    function (request, response) {
      api.getData(function (data) {
        var msg = 'The air pressure is ' + data.press + ' ' + data.pressUnits;
        response.say(msg).send();
      });
      return false;
    });
};