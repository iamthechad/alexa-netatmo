var api = require('../util/netatmo');

module.exports = function(app) {
  app.intent('AskPressure',
    {
      'utterances': ['{what\'s|what is} the {air|} pressure']
    },
    function (request, response) {
      api.getData(function (error, data) {
        var msg;
        if (error) {
          msg = 'Sorry. There was an error retrieving the air pressure.';
        } else {
          msg = 'The air pressure is ' + data.press + ' ' + data.pressUnits;
        }
        response.card({
          type: 'Simple',
          title: 'Netatmo Air Pressure',
          content: msg
        }).say(msg).send();
      });
      return false;
    });
};