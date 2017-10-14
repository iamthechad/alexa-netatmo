var api = require('../util/netatmo');

module.exports = function (app) {

  app.intent('AskTemperature',
    {
      'slots': {'LOCATION': 'LOCATION'},
      'utterances': ['{what\'s|what is} the temperature {in|in the|} {-|LOCATION}']
    },
    function (request, response) {
      var location = request.slot('LOCATION');
      if (typeof location === 'undefined' || location === '') {
        location = 'all';
      }
      api.getData(function (error, data) {
        var msg;
        if (error) {
          msg = 'Sorry. There was an error retrieving the temperature.';
        } else {
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
        }
        response.card({
          type: 'Simple',
          title: 'Netatmo Temperature',
          content: msg
        }).say(msg).send();
      });
      return false;
    });
};