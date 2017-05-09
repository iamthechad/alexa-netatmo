var MBAR_TO_INHG = 0.02953;
var MBAR_TO_MMHG = 0.750062;

var MM_TO_INCHES = 0.0393701;

module.exports = {
  convertTemperature: function(originalValue, naUserSetting) {
    if (naUserSetting === 0) {
      return roundNumber(originalValue);
    }

    return roundNumber(originalValue * (9 / 5) + 32);
  },

  convertRain: function(originalValue, naUserSetting) {
    if (naUserSetting === 0) {
      return roundNumberWithPrecision(originalValue, 2);
    }

    return roundNumberWithPrecision(originalValue * MM_TO_INCHES, 2);
  },

  convertPressure: function(originalValue, naUserSetting) {
    var retValue;
    switch (naUserSetting) {
      case 1:
        retValue = originalValue * MBAR_TO_INHG;
        break;
      case 2:
        retValue = originalValue * MBAR_TO_MMHG;
        break;
      default:
        retValue = originalValue;
    }
    return roundNumber(retValue);
  },

  getPressureUnitsString: function(naUserSetting) {
    switch (naUserSetting) {
      case 0:
        return 'millibars';
      case 1:
        return 'inches mercury';
      case 2:
        return 'millimeters mercury';
      default:
        return '';
    }
  }
};

function roundNumber(value) {
  return roundNumberWithPrecision(value, 1);
}

function roundNumberWithPrecision(value, precision) {
  var roundVar = 10;
  if (precision > 1) {
    for (var i = 0; i < precision; i++) {
      roundVar *= 10;
    }
  }
  return Math.ceil(value * roundVar) / roundVar;
}