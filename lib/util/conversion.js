var MBAR_TO_INHG = 0.02953;
var MBAR_TO_MMHG = 0.750062;

module.exports = {
  convertTemperature: function(originalValue, naUserSetting) {
    if (naUserSetting === 0) {
      return roundNumber(originalValue);
    }

    return roundNumber(originalValue * (9 / 5) + 32);
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
  return Math.ceil(value * 10) / 10;
}