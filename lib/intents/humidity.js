var api = require('../util/netatmo');

module.exports = function(app) {
  app.intent('AskHumidity',
    {
      'slots': {'Location': 'LITERAL'},
      'utterances': ['{what\'s|what is} the humidity {in|in the|} {locations|Location}']
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
            msg = 'The humidity inside is ' + data.humIn + '%';
            break;
          case 'outside':
            msg = 'The humidity outside is ' + data.humOut + '%';
            break;
          case 'all':
            msg = 'The humidity is ' + data.humIn + '% inside and ' + data.humOut + '% outside';
            break;
          default:
            if (data.extraModules.hasOwnProperty(location)) {
              var locationData = data.extraModules[location];
              msg = 'The humidity is ' + locationData.hum + '% in the ' + location +  '.';
            } else {
              msg = 'Sorry. There\'s no location called ' + location + '.';
            }
        }

        response.say(msg).send();
      });
      return false;
    });
};