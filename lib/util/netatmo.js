var https = require('https');
var querystring = require('querystring');

var credentials = require('../../credentials');
var conversion = require('./conversion');

module.exports = {
  getData: function (callback) {

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

    // get token and set callbackmethod to get measure
    doCall(payload, options, onReceivedTokenResponse, callback);
  }
};

function doCall(payload, options, onResponse, callback) {

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');

    var fullResponse = '';

    res.on('data', function (chunk) {
      fullResponse = fullResponse + chunk;
    });

    /*res.on('error', function (chunk) {
      console.log('Error: ' + chunk);
    });*/

    res.on('end', function () {
      try {
        var parsedResponse = JSON.parse(fullResponse);
        onResponse(null, parsedResponse, callback);
      } catch (e) {
        onResponse(e, null, callback);
      }
      //callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

  });

  /*req.on('error', function (e) {
    console.log('error: ' + e);
  });*/
  req.write(payload);

  req.end();
}

function onReceivedTokenResponse(error, parsedResponse, callback) {

  if (error) {
    return callback(error);
  }

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

function getMeasure(error, parsedResponse, callback) {

  if (error) {
    return callback(error);
  }

  //console.log(JSON.stringify(parsedResponse));
  var mainUnits = parsedResponse.body.user.administrative.unit;
  var pressureUnits = parsedResponse.body.user.administrative.pressureunit;

  var rootDevice = parsedResponse.body.devices[0];

  var data = {
    tempIn: conversion.convertTemperature(rootDevice.dashboard_data.Temperature, mainUnits),
    humIn: rootDevice.dashboard_data.Humidity,
    sound: rootDevice.dashboard_data.Noise,
    co2: rootDevice.dashboard_data.CO2,
    press: conversion.convertPressure(rootDevice.dashboard_data.Pressure, pressureUnits),
    pressUnits: conversion.getPressureUnitsString(pressureUnits),
    rain: {},

    extraModules: {}
  };

  rootDevice.modules.forEach(function (module) {
    switch (module.type) {
      case 'NAModule1':
        data.tempOut = conversion.convertTemperature(module.dashboard_data.Temperature, mainUnits);
        data.humOut = module.dashboard_data.Humidity;
        data.rfStrengthOut = module.rf_status;
        data.batteryOut = module.battery_percent;
        break;
      case 'NAModule2':
        // Wind module not supported yet
        break;
      case 'NAModule3':
        // Rain module
        data.rain.raining = module.dashboard_data.Rain > 0;
        data.rain.lastHour = conversion.convertRain(module.dashboard_data.sum_rain_1, mainUnits);
        data.rain.lastDay = conversion.convertRain(module.dashboard_data.sum_rain_24, mainUnits);
        data.rain.units = mainUnits === 0 ? 'millimeters' : 'inches';
        data.rain.rfStrengthOut = module.rf_status;
        data.rain.batteryOut = module.battery_percent;
        break;
      case 'NAModule4':
        data.extraModules[module.module_name.toLowerCase()] = {
          name: module.module_name,
          temp: conversion.convertTemperature(module.dashboard_data.Temperature, mainUnits),
          hum: module.dashboard_data.Humidity,
          co2: module.dashboard_data.CO2
        };
        break;
    }
  });

  callback(null, data);
}