<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Netatmo Skill for Alexa](#netatmo-skill-for-alexa)
  - [Getting Started - Local Setup](#getting-started---local-setup)
    - [Exercising the Skill Locally](#exercising-the-skill-locally)
  - [Getting Started - Deployment to AWS](#getting-started---deployment-to-aws)
    - [Prepare Code for Deployment](#prepare-code-for-deployment)
    - [Creating the Lambda](#creating-the-lambda)
    - [Creating the Alexa Skill](#creating-the-alexa-skill)
    - [Add the skill to Alexa](#add-the-skill-to-alexa)
    - [Adding one more layer of security](#adding-one-more-layer-of-security)
  - [Feature Support](#feature-support)
    - [Temperature](#temperature)
      - [Locations](#locations)
      - [Units](#units)
      - [Cards](#cards)
      - [Phrases](#phrases)
      - [TODO/Known Issues](#todoknown-issues)
    - [Humidity](#humidity)
      - [Locations](#locations-1)
      - [Units](#units-1)
      - [Cards](#cards-1)
      - [Phrases](#phrases-1)
      - [TODO/Known Issues](#todoknown-issues-1)
    - [Air Pressure](#air-pressure)
      - [Locations](#locations-2)
      - [Units](#units-2)
      - [Cards](#cards-2)
      - [Phrases](#phrases-2)
      - [TODO/Known Issues](#todoknown-issues-2)
    - [Carbon Dioxide](#carbon-dioxide)
      - [Locations](#locations-3)
      - [Units](#units-3)
      - [Cards](#cards-3)
      - [Phrases](#phrases-3)
      - [TODO/Known Issues](#todoknown-issues-3)
    - [Sound Level](#sound-level)
      - [Locations](#locations-4)
      - [Units](#units-4)
      - [Cards](#cards-4)
      - [Phrases](#phrases-4)

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

## Getting Started - Deployment to AWS

Deploying the skill requires accessing two different areas of Amazon's infrastructure. The actual code to run is deployed in AWS as a Lambda, and the Alexa skill is created through the developer interface.

### Prepare Code for Deployment

* If you have not yet done so, install the Gulp command line client via `npm install -g gulp-cli`. (You may need to preface that command with `sudo` if you did not use NVM to install NodeJS.)
* In the `alexa-server/apps/alexa-netatmo` directory, run `gulp`. This will kick off the default workflow and create a zip file in `alexa-server/apps/alexa-netatmo` named `netatmo.zip`.
* Keep track of the `netatmo.zip` file. It will be uploaded to AWS in the next step.

### Creating the Lambda

If you do not have an AWS account, you need to create one. For personal use of this skill, a free account should be sufficient.
Instructions for creating an AWS account and more information about Lambdas can be found in the [AWS Lambda Getting Started Guide](http://docs.aws.amazon.com/lambda/latest/dg/setup.html).

1. Once logged in to the AWS dashboard, access the Lambda service. There may be a couple of ways to navigate:
  * From the "Services" drop-down menu at the top of the page, select "Compute" -> "Lambda"
  * From the dashboard, expand the "All Services" section and select "Compute" -> "Lambda"
1. Select "Create a Lambda Function"
1. Select "Blank Function"
1. Click in the dotted outline to show the list of selectable triggers, and select "Alexa Skills Kit"
1. Select "Next"
1. Give the Lambda a name
1. Select "Node.js 4.3" as the Runtime
1. In "Code Entry Type", select "Upload a Zip File"
1. Select the "Upload" button, and select the `netatmo.zip` file that was previously created.
1. Leave "Handler" as-is
1. Select the Role to use when running the lambda
    * If you have previously created a lambda, you can select its role under "Role"
    * To create a new role:
        1. Select "Create new role from template(s)" in the "Role" dropdown
        1. Enter a new role name. This name is unique across your AWS account, so use a descriptive name like `lambda_basic_execution`
        1. No selection of template is actually necessary - the role will be created with the correct execution privileges.
1. In the "Advanced Settings" section, increase the "Timeout" to 7 seconds
1. Select "Next", then select "Create Function" to create the lambda
1. Take note of the "ARN" value displayed in the upper-right once the lambda is created. This value will be needed to create the skill in the next step.

### Creating the Alexa Skill

To add the Alexa skill, you'll need an Amazon developer account. Sign up at https://developer.amazon.com

1. Once logged in to the developer portal, select the "Alexa" header at the top of the page.
1. Select the "Get Started" button under the "Alexa Skills Kit" header.
1. Select the "Add a New Skill" button. **During the skill creation process leave all defaults as-is unless specified in the steps below.**
1. Enter a name for the skill. I don't know how unique these names must be, but I simply entered `netatmo`.
1. Enter an Invocation Name. This is what wil be used when you say "Alexa, ask XXX". I've discovered that Alexa has a very hard time understanding the word "netatmo", so I don't recommend it as an invocation name. I used `weather station` for my skill.
1. Select "Next"
1. Enter the schema and utterances for the skill. If you've not changed the behavior of the skill, these are located in `alexa-server/apps/alexa-netatmo/schema.json` and `alexa-server/apps/alexa-netatmo/utterances.txt`. Open these files and copy their contents into the corresponding area.
    * **Please refer to TBD section for re-creating these files when the skill behavior has changed.**
1. Select "Add Slot Type" to add the required custom slot type.
    1. In the "Enter Type" field, enter `LOCATION`
    1. In the "Enter Values" field, enter (each value goes on a separate line):
        * `Inside`
        * `Outside`
        * `Great Room`
        * `Living Room`
        * `Bedroom`
        * `Master Bedroom`
    1. Save the slot type
1. Select "Next"
1. For "Service Endpoint Type", select "AWS Lambda ARN"
1. Select your geographic region, likely "North America"
1. Paste in the ARN for the lambda previously created
1. Select "Next"
1. The skill should be ready for testing
    * On the "Test" tab, verify that everything is working by typing something like "what's the temperature" in the utterance field and selecting the "Ask" button.
    * If all is working properly, the lambda response should contain the proper values.

### Add the skill to Alexa

* If you used the same account for Alexa as you did for the Amazon Developer account, the skill should already be listed in "Your Skills" in the Alexa app.

### Adding one more layer of security

The lambda function can be protected so that only an authorized resource can call it. This can prevent unwanted usage that may lead to unexpected charges.

1. In the Amazon Developer dashboard, navigate to "Alexa" -> "Alexa Skills Kit" -> "Getting Started"
1. Select your skill from the list.
1. Copy the "Application Id" value from the "Skill Information" tab.
1. In `alexa-server/apps/alexa-netatmo`, copy `appid.js.sample` to `appid.js`.
1. Paste the copied application id between the quotes in `appid.js`.
1. Re-create the zip file by running `gulp` in the `alexa-server/apps/alexa-netatmo` directory.
1. In the AWS dashboard, access the Lambda section and select the previously created lamdba.
1. Select the "Code" tab, then select "Upload a .ZIP file" for "Code entry type" and upload the newly updated `netatmo.zip` file.
1. Return to the Amazon Developer portal and verify that the skill is still working.


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

### Humidity

#### Locations

* By default, if no location is specified the skill will return the external humidity and the internal humidity at the main module.
* Specifying 'inside' as the location will return the internal humidity at the main module.
* Specifying 'outside' as the location will return the external humidity.
* Additional internal modules can be dynamically queried by name as location, but the value must be lower case.
    * For example, I have an additional module named "Master Bedroom". I can query it by using the location `master bedroom`.

#### Units

* Humidity is presented in percentage, so no unit conversion happens.

#### Cards

* No card at present

#### Phrases

* All valid phrases are listed in the `utterances.txt` file with the `AskHumidity` prefix.
* `LOCATION` is optional. If omitted, the skill will return internal and external humidity.

#### TODO/Known Issues

* Externalize/internationalize strings?
* Request to get all known module names.
* Add an app card

### Air Pressure

#### Locations

* No locations are supported since only the main module reports pressure.

#### Units

* Pressure should be returned in the units that the Netatmo user has configured for their installation.

#### Cards

* No card at present

#### Phrases

* All valid phrases are listed in the `utterances.txt` file with the `AskPressure` prefix.
* No locations are supported since the pressure is only measured by the main module.

#### TODO/Known Issues

* Externalize/internationalize strings?
* Add an app card

### Carbon Dioxide

#### Locations

* By default, if no location is specified the skill will return the CO2 levels for all known internal modules.
* Specifying 'inside' as the location will return the CO2 level at the main module.
* Specifying 'outside' as the location will return an error since the external module does not support CO2.
* Additional internal modules can be dynamically queried by name as location, but the value must be lower case.
    * For example, I have an additional module named "Master Bedroom". I can query it by using the location `master bedroom`.

#### Units

* CO2 is presented in parts per million so no conversion is required.

#### Cards

* No card at present

#### Phrases

* All valid phrases are listed in the `utterances.txt` file with the `AskCarbonDioxide` prefix.
* `LOCATION` is optional. If omitted, the skill will return CO2 levels for all known internal modules.

#### TODO/Known Issues

* Externalize/internationalize strings?
* Add an app card

### Sound Level

#### Locations

* No locations are supported since only the main module reports sound level.

#### Units

* Sound level is presented in decibels. No conversion is required.

#### Cards

* No card at present

#### Phrases

* All valid phrases are listed in the `utterances.txt` file with the `AskSound` prefix.
* No locations are supported since the sound level is only measured by the main module.