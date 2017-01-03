<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Netatmo Skill for Alexa](#netatmo-skill-for-alexa)
  - [Getting Started - Local Setup](#getting-started---local-setup)
    - [Exercising the Skill Locally](#exercising-the-skill-locally)
  - [Feature Support](#feature-support)
    - [Temperature](#temperature)
      - [Locations](#locations)
      - [Units](#units)
      - [Cards](#cards)
      - [Phrases](#phrases)
      - [TODO/Known Issues](#todoknown-issues)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Netatmo Skill for Alexa

This is an Alexa skill that allows you to query various aspects of your Netatmo.

Currently supported:

* Temperature
* Humidity
* Carbon Dioxide
* Air Pressure
* Sound Level

Not yet supported:

* Wind
* Rain

## Getting Started - Local Setup

It's very important that you test your skill locally before deploying to AWS. This allows for the interaction with the Netatmo API to be verified.

1. Install NodeJS version **4.x**
    * Follow any steps you wish to install - I prefer to use [NVM](https://github.com/creationix/nvm)
    * AWS uses NodeJS `4.3`, but any `4.x` version seems to work
1. Set up a [Netatmo Developer](https://dev.netatmo.com) account and create a new application
    * Select `Create an App`
    * Name and description are required. (Names are globally unique so I would suggest using a unique prefix - I used 'Megatome Alexa')
    * Save the App
    * Take note of the `Client id` and `Client secret` values - you'll need them to run the server
1. Check out the [`alexa-server`](https://github.com/iamthechad/alexa-server) project
1. Check out the [`alexa-netatmo`](https://github.com/iamthechad/alexa-netatmo) project into the `alexa-server/apps` directory
1. Install the dependencies
    * In the `alexa-server` directory, run `npm install`
    * In the `alexa-server/apps/alexa-netatmo` directory, run `npm install`
1. Set up API credentials
    * In `alexa-server/apps/alexa-netatmo`, copy `credentials.js.sample` to `credentials.js`
    * Edit `credentials.js`, entering your Netatmo credentials and API keys
1. Run the server
    * In the `alexa-server` directory, run `node server.js`
1. Access the Netatmo module
    * Once the server is running successfully, go to http://localhost:8080/alexa/netatmo-alexa

### Exercising the Skill Locally

The server will provide a web UI that can be used to access the various portions of the skill. Nearly all interactions will be with `intentions`.

To check the temperature:

1. In the `Request` section of the web UI, select `IntentRequest` for `Type`, then select `AskTemperature` for `Intent`. Leave `LOCATION` blank for now.
1. Click the `Send Request` button.
1. The `Response` section should contain a valid response from your Netatmo if everything worked as expected.
1. Try some variations
    * Specify `inside` or `outside` in the `LOCATION` field
    * I have a module set up in my bedroom named "Master Bedroom". I can enter `master bedroom` (all lower-case) in the location field to get its temperature

## Feature Support

### Temperature

#### Locations

* By default, if no location is specified the skill will return the external temperature and the internal temperature at the main module.
* Specifying 'inside' as the location will return the internal temperature at the main module.
* Specifying 'outside' as the location will return the external temperature.
* Additional internal modules can be dynamically queried by name as location, but the value must be lower case.
    * For example, I have an additional module named "Master Bedroom". I can query it by using the location `master bedroom`.

#### Units

* Temperature should be returned in the units that the Netatmo user has configured for their installation.

#### Cards

* A simple card will be provided for the Alexa app.

#### Phrases

* All valid phrases are listed in the `utterances.txt` file with the `AskTemperature` prefix.
* `LOCATION` is optional. If omitted, the skill will return internal and external temperature.

#### TODO/Known Issues

* Externalize/internationalize strings?
* "Full Summary" request to get temperature from all known modules.
* Request to get all known module names.
* Enhance the app card
