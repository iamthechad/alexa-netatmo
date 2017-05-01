var alexa = require('alexa-app');
var app = new alexa.app('netatmo-alexa');

app.exhaustiveUtterances = true;
app.dictionary = {'locations': ['Inside', 'Outside']};

require('./lib/intents/temperature')(app);
require('./lib/intents/humidity')(app);
require('./lib/intents/pressure')(app);
require('./lib/intents/co2')(app);
require('./lib/intents/sound')(app);
require('./lib/intents/rain')(app);

// eslint-disable-next-line no-unused-vars
var APP_ID;
try {
  APP_ID = require('./appid').id;
} catch (e) {
  // eslint-disable-next-line no-console
  console.log('No APP_ID specified');
}

// Output the schema
//console.log( '\n\nSCHEMA:\n\n'+app.schema()+'\n\n' );
// Output sample utterances
//console.log( '\n\nUTTERANCES:\n\n'+app.utterances()+'\n\n' );

module.exports = app;

// Connect to lambda
//exports.handler = app.lambda();
