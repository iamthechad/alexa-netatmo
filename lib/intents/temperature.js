var api = require('../util/netatmo');

module.exports = function(app) {

  app.intent('AskTemperature',
    {
      'slots': {'Location': 'LITERAL'},
      'utterances': ['{what\'s|what is} the temperature {in|in the|} {locations|Location}']
    },
    function (request, response) {
      var location = request.slot('Location');
      if (typeof location === 'undefined' || location === '') {
        location = 'all';
      }
      api.getData(function (data) {
        var msg = '';
        switch (location) {
          case 'inside':
            msg = 'It is ' + data.tempIn + ' degrees inside';
            break;
          case 'outside':
            msg = 'It is ' + data.tempOut + ' degrees outside';
            break;
          case 'all':
            msg = 'It is ' + data.tempIn + ' degrees inside and ' + data.tempOut + ' degrees outside';
            break;
          default:
            if (data.extraModules.hasOwnProperty(location)) {
              var locationData = data.extraModules[location];
              msg = 'It is ' + locationData.temp + ' degrees in the ' + location;
            } else {
              msg = 'Sorry. There\'s no location called ' + location;
            }
        }

        response.say(msg).send();
      });
      return false;
    });
};