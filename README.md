[![Build Status](https://travis-ci.org/u2i/confy.svg?branch=develop)](https://travis-ci.org/u2i/confy)
[![Code Climate](https://codeclimate.com/github/u2i/confy/badges/gpa.svg)](https://codeclimate.com/github/u2i/confy)
[![Test Coverage](https://codeclimate.com/github/u2i/confy/badges/coverage.svg)](https://codeclimate.com/github/u2i/confy/coverage)

Confy
=================

Table of Contents
-----------------

  * [Confy](#confy)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Config](#config)
    * [Running](#running-the-development-server)
    * [Running tests](#running-tests)
      * [Rails tests](#rails-tests)
      * [React tests](#react-tests)
      * [Linting](#linting)
      * [Running all tests](#running-all-tests)
    * [Deployment](#deployment)
      * [Kubernetes](#kubernetes)
      * [Review Apps](#review-apps)
    * [Gotchas](#gotchas)
      * [Push notifications](#push-notifications)
    * [Resources](#resources)
  * [Confy Native](#confy-native)

Prerequisites
--------------

* Docker
* Docker Compose

Installation
--------------

```bash
$ docker build -t confy:1.0 .
```
```bash
$ CONFY_VERSION=1.0 docker-compose run web rake db:setup
```

Config
--------------

In order for the application to work you need to configure your environment. Check out [.env.example](https://github.com/u2i/confy/blob/develop/.env.example) for a `.env` template.

`HOSTNAME`: address on which your rails server is running. Usually `https://localhost:PORT` where `PORT` is `3000` by default

`NOTIFICATION_HOST`: hostname where Google should send push notifications. Check [Gotchas#Push Notifications](#push-notifications)

`APPLICATION_OWNER`: email address - can be anybody who has owner status in Google Developer Console

`GOOGLE_CLIENT_(ID|SECRET)`: look in [Google Developer Console](https://console.developers.google.com/apis/credentials/oauthclient/659112718098-i3u6g3s46vv5tccjvjcsfhrfta3omdvc.apps.googleusercontent.com?project=effective-relic-136507) `Confy > Credentials > OAuth 2.0 client IDs > Web Client 1`

`GOOGLE_(CLIENT_EMAIL|PRIVATE_KEY|DEFAULT_CLIENT_ID)`: go to [Google Developer Console](https://console.developers.google.com/iam-admin/serviceaccounts/project?project=effective-relic-136507) and `Confy > Credentials > Service Account keys > Manage service accounts` then add a new private key for `push-notifications` service account. This will create a new private key file - find the necessary fields there

`SECRET_KEY_BASE`: used by rails. You can use `rails secret` to generate a secure secret key. Look in [secrets.yml](https://github.com/u2i/confy/blob/develop/config/secrets.yml) for more info

Or you can just ask someone for their `.env` file :)

Encryption
--------------
Several files are encrypted: .env.enc, gcloud_credentials.json.enc, kubernetes/env.yml.enc

You can decrypt/encrypt them using key that can be found in LastPass, Shared-confy/ENV_CRYPT_KEY

Encrypt:
```bash
$ openssl enc -aes-256-cbc -k $ENV_CRYPT_KEY -in .env -out .env.enc
```

Decrypt:
```bash
$ openssl enc -d -aes-256-cbc -k $ENV_CRYPT_KEY -in .env.enc -out .env2
```

Running the development server
--------------


```bash
$ CONFY_VERSION=1.0 docker-compose up
```

This will run the Rails server, Postgres, Redis, Sidekiq, as well as a Webpack development server that will hot reload assets as you change them.

Running tests
--------------

### Rails tests
```bash
$ CONFY_VERSION=1.0 docker-compose run web bundle exec rspec
```

Or
```bash
$ CONFY_VERSION=1.0 docker-compose run web bundle exec guard
```
to watch for test and code changes

Here's [how to setup Guard in RubyMine](http://stackoverflow.com/questions/11996124/is-it-impossible-to-use-guard-with-rubymine#answer-12000765)

### React tests
```bash
$ CONFY_VERSION=1.0 docker-compose run web npm run test
```
or
```bash
$ CONFY_VERSION=1.0 docker-compose run web rake test:client
```

### Linting
```bash
$ CONFY_VERSION=1.0 docker-compose run web npm run lint
```

### Running all tests
```bash
$ CONFY_VERSION=1.0 docker-compose run web rake test:all
```

Deployment
--------------

### Kubernetes
After successful test phase, travis automatically pushes new image to GCR (only when git tag is present) with appropriate version derived from git tag.

You need to manually change image version in `kubernetes/confy-app.yml` and `kubernetes/cron.yml` files and then apply changes in order to deploy new version.

Once you've done that, run
```bash
kubectl apply -f kubernetes/confy-app.yml --namespace confy
kubectl apply -f kubernetes/cron.yml --namespace confy
```

Check the pods
```bash
kubectl get pods --namespace confy
```

Gotchas
--------------

### Push notifications
If you want to have push notifications from Google work locally you will need to expose your local server to the Internet.
First of all, install [ngrok](https://ngrok.com/download).

Once you've done that, run
```bash
$ ngrok http 3000
```
which will create a tunnel to your local server.

Unfortunately the free version of ngrok will generate a random domain for you every time you run it. That means you will need to verify this domain in Google Developer Console every time you restart the ngrok server. To verify your domain go to [Google Domain Verification](https://console.developers.google.com/apis/credentials/domainverification?project=effective-relic-136507), add your ngrok domain and follow the instructions.

Once your domain is verified you also need to set `NOTIFICATION_HOST` to your ngrok domain in `.env`.

Resources
--------------

Here's some reading if you're bored! (or you want to learn more about Confy and the technologies it uses)

* [ES6](https://babeljs.io/docs/learn-es2015/)
* [React](https://facebook.github.io/react/)
* [React on Rails](https://github.com/shakacode/react_on_rails)
* [React Bootstrap](https://react-bootstrap.github.io/)
* [Webpack](https://blog.madewithlove.be/post/webpack-your-bags/)

* [Action Cable](http://edgeguides.rubyonrails.org/action_cable_overview.html)
* [Ruby Google API Client](https://developers.google.com/api-client-library/ruby/start/installation)
* [Google Calendar API Reference](https://developers.google.com/google-apps/calendar/v3/reference/)
* [Google Calendar Ruby API Docs](http://www.rubydoc.info/github/google/google-api-ruby-client/Google/Apis/CalendarV3)

* [Enzyme](http://airbnb.io/enzyme/)
* [Mocha](https://mochajs.org/)
* [Sinon](http://sinonjs.org/)


Confy Native
=================

This is a native client for iOS and Android devices.


Development
--------------

In order to start the development you need to install the Expo CLI. More info [here](https://expo.io/learn)


Deployment
--------------

Once the development is finished you can publish the changes using the expo command. More info [here](https://docs.expo.io/versions/latest/workflow/publishing)

```bash
cd native
$ expo publish
```

All the necessary credentials you will find in LastPass

Building
--------------

In case you changes require a new IPA/APK build you can use the expo command too. More info [here](https://docs.expo.io/versions/latest/distribution/building-standalone-apps)

```bash
cd native
$ expo build:android
$ expo build:ios
```

Client Configuration
--------------

* In order to install the client on the mobile device, you need to download the newest version of IPA/APK file on the device.
* In case of Android device you can email the build URL which you can find on the expo [builds page](https://expo.io/builds)
* Just download the file and install it on the device.
* You will probably need to [authorize the device](#client-authorization)
* In the Confy app setting section you will be able to associate the device with one of the conference rooms.

Device Authorization
--------------

In case your device is not yet authorized, you can do it in the [Confy Admin Panel](http://confy.u2i.com/admin/devices)
Find the device on the list (by name or device id) and authorize it. Once you do it, please re-open the Confy application.

All the necessary credentials you will find in LastPass

Automate
--------------

For better user experience on Adroid devices we use Automate. It allow us to wake up the Confy app at the specific time and put the device to sleep after certain hour. You can find the Confy automate flow in the automate public directory. Just search for Confy and install the flow on the device and activate the flow.
