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

    res.on('data', function (chunk) {
      //console.log('body: ' + chunk);
      var parsedResponse = JSON.parse(chunk);
      if (typeof onResponse !== 'undefined') {
        onResponse(parsedResponse, callback);
      }
    });

    /*res.on('error', function (chunk) {
      console.log('Error: ' + chunk);
    });*/

    res.on('end', function () {
      //callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

  });

  /*req.on('error', function (e) {
    console.log('error: ' + e);
  });*/
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
  var pressureUnits = parsedResponse.body.user.administrative.pressureunit;

  var rootDevice = parsedResponse.body.devices[0];

  var data = {
    tempIn: conversion.convertTemperature(rootDevice.dashboard_data.Temperature, tempUnits),
    humIn: rootDevice.dashboard_data.Humidity,
    sound: rootDevice.dashboard_data.Noise,
    co2: rootDevice.dashboard_data.CO2,
    press: conversion.convertPressure(rootDevice.dashboard_data.Pressure, pressureUnits),
    pressUnits: conversion.getPressureUnitsString(pressureUnits),

    extraModules: {}
  };

  rootDevice.modules.forEach(function (module) {
    if (module.type === 'NAModule1') {
      data.tempOut = conversion.convertTemperature(module.dashboard_data.Temperature, tempUnits);
      data.humOut = module.dashboard_data.Humidity;
      data.rfStrengthOut = module.rf_status;
      data.batteryOut = module.battery_vp;
    } else if (module.type === 'NAModule4') {
      data.extraModules[module.module_name.toLowerCase()] = {
        name: module.module_name,
        temp: conversion.convertTemperature(module.dashboard_data.Temperature, tempUnits),
        hum: module.dashboard_data.Humidity,
        co2: module.dashboard_data.CO2
      };
    }
  });

  callback(data);
}