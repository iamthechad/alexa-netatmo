var https = require('https');
var querystring = require('querystring');

var alexa = require('alexa-app');
var app = new alexa.app('netatmo-alexa');

var credentials = require('./credentials');

app.exhaustiveUtterances = true;
app.dictionary = {'locations': ['Inside', 'Outside']};

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
    console.log("You asked for the temperature in " + location);
    getData(function (data) {
      var msg = '';
      switch (location) {
        case 'inside':
          msg = "It is " + data.tempIn + " degrees inside.";
          break;
        case 'outside':
          msg = "It is " + data.tempOut + " degrees outside.";
          break;
        case 'all':
          msg = "It is " + data.tempIn + " degrees inside and " + data.tempOut + " degrees outside.";
          break;
        default:
          if (data.hasOwnProperty(location)) {
            var locationData = data[location];
            msg = "It is " + locationData.temp + " degrees in the " + location +  ".";
          } else {
            msg = "Sorry. There's no location called " + location + ".";
          }
      }

      response.say(msg).send();
    });
    return false;
  });

function getData(callback) {

  //console.log("sending request to netatmo...");

  var payload = querystring.stringify({
    'grant_type': 'password',
    'client_id': credentials.clientId,
    'client_secret': credentials.clientSecret,
    'username': credentials.userId,
    'password': credentials.pass,
    'scope': 'read_station'
  });

  var options = {
    host: 'api.netatmo.com',
    path: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload)
    }

  };

  //console.log('making request with data: ', options);

  // get token and set callbackmethod to get measure
  doCall(payload, options, onReceivedTokenResponse, callback);
}

function doCall(payload, options, onResponse,
                callback) {

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');

    //console.log("statusCode: ", res.statusCode);
    //console.log("headers: ", res.headers);


    res.on('data', function (chunk) {
      //console.log("body: " + chunk);
      var parsedResponse = JSON.parse(chunk);
      if (typeof onResponse !== 'undefined') {
        onResponse(parsedResponse, callback);
      }

    });

    res.on('error', function (chunk) {
      console.log('Error: ' + chunk);
    });

    res.on('end', function () {

      //callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

  });

  req.on('error', function (e) {
    console.log('error: ' + e)
  });
  req.write(payload);

  req.end();

}

function onReceivedTokenResponse(parsedResponse, callback) {

  var payload = querystring.stringify({
    'access_token': parsedResponse.access_token
  });

  var options = {
    host: 'api.netatmo.com',
    path: '/api/getstationsdata',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload)
    }

  };

  doCall(payload, options, getMeasure, callback);

}

function getMeasure(parsedResponse, callback) {

  //console.log(JSON.stringify(parsedResponse));
  var tempUnits = parsedResponse.body.user.administrative.unit;

  var rootDevice = parsedResponse.body.devices[0];

  var data = {
    tempIn: convertTemperature(rootDevice.dashboard_data.Temperature, tempUnits),
    humIn: rootDevice.dashboard_data.Humidity,
    co2: rootDevice.dashboard_data.CO2,
    press: rootDevice.dashboard_data.Pressure,

    extraModules: {},
    /*tempOut: parsedResponse.body.modules[0].dashboard_data.Temperature,
     humOut: parsedResponse.body.modules[0].dashboard_data.Humidity,
     rfStrengthOut: parsedResponse.body.modules[0].rf_status,
     batteryOut: parsedResponse.body.modules[0].battery_vp,

     rainGauge: parsedResponse.body.modules[1].dashboard_data,
     rainGaugeBattery: parsedResponse.body.modules[1].battery_vp*/
    rainGauge: 0
  };

  rootDevice.modules.forEach(function (module) {
    if (module.type === 'NAModule1') {
      data.tempOut = convertTemperature(module.dashboard_data.Temperature, tempUnits);
      data.humOut = module.dashboard_data.Humidity;
      data.rfStrengthOut = module.rf_status;
      data.batteryOut = module.battery_vp;
    } else if (module.type === 'NAModule4') {
      data[module.module_name.toLowerCase()] = {
        temp: convertTemperature(module.dashboard_data.Temperature, tempUnits),
        hum: module.dashboard_data.Humidity,
        co2: module.dashboard_data.CO2
      };
    }
  });

  callback(data);
}

// Output the schema
//console.log( "\n\nSCHEMA:\n\n"+app.schema()+"\n\n" );
// Output sample utterances
//console.log( "\n\nUTTERANCES:\n\n"+app.utterances()+"\n\n" );

function convertTemperature(originalValue, naUserSetting) {
  if (naUserSetting === 0) {
    return roundNumber(originalValue);
  }

  return roundNumber(originalValue * (9 / 5) + 32);
}

function roundNumber(value) {
  return Math.ceil(value * 10) / 10;
}

module.exports = app;
//app.express( express_app, "/netatmo/", true );

// Connect to lambda
//exports.handler = app.lambda();
