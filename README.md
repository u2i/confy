[![Build Status](https://travis-ci.org/u2i/confy.svg?branch=develop)](https://travis-ci.org/u2i/confy)
[![Code Climate](https://codeclimate.com/github/u2i/confy/badges/gpa.svg)](https://codeclimate.com/github/u2i/confy)
[![Test Coverage](https://codeclimate.com/github/u2i/confy/badges/coverage.svg)](https://codeclimate.com/github/u2i/confy/coverage)

# Confy

## Prerequisites
* Ruby v2.3.0
* Node.js v4.4.7 or higher
* PostgreSQL
* [Sidekiq](https://github.com/mperham/sidekiq)
* [Redis](http://redis.io/download)
* [Foreman](https://github.com/ddollar/foreman)

## Installation
```bash
$ bundle install
```
```bash
$ npm install
```
```bash
$ rake db:setup
```

## Running the server in development
Make sure you have Redis running.

```bash
$ foreman start -f Procfile.dev
```
or
```bash
$ npm start
```
which will run the above command for you. You can specify the Rails port by setting the `PORT` environment variable.

This will run the Rails server, Redis server, Sidekiq, as well as a Webpack development server that will hot reload assets as you change them.

## Running tests

### Rails tests
```bash
$ rspec
```

Or install [Guard](https://github.com/guard/guard) and 
```bash
$ bundle exec guard
```
to watch for test and code changes

Here's [how to setup Guard in RubyMine](http://stackoverflow.com/questions/11996124/is-it-impossible-to-use-guard-with-rubymine#answer-12000765)

### React tests
```bash
$ npm run test
```
or
```bash
$ rake test:client
```

### Linting
```bash
$ npm run lint
```

### Running all tests
```bash
$ rake test:all
```

## Deployment
All changes to `develop` branch are automatically deployed to Heroku [Staging](https://u2i-confy-staging.herokuapp.com/). That means that ideally you would never deploy manually and instead create a Pull Request for your changes which will get deployed after being merged. 

To deploy to [production](https://u2i-confy.herokuapp.com/) you can either promote the staging app to production in [Heroku Dashboard](https://dashboard.heroku.com/pipelines/1cbd7b9e-0cb0-4da3-9f6d-56761206e16f) or commit to `master` branch.

Heroku will not build any deployments with failing tests!

### Review Apps
Review Apps are enabled on Heroku Dashboard. That means you can create a temporary app for your Pull Request.
To deploy a Review App you simply need to find your PR on the list in [Heroku Dashboard](https://dashboard.heroku.com/pipelines/1cbd7b9e-0cb0-4da3-9f6d-56761206e16f) Review Apps and click on **Create Review App**. After that any changes to that branch will cause an automatic deployment to your Review App.

There is an extra step you need to take for your Review App to work. We currently only support logging in via Google OAuth. If you try to launch your Review App now you will find an error from Google saying that the URI is not authorized. Follow the instructions and add the Review App to the Authorized redirect URIs in [Google Developer Console](https://console.developers.google.com/apis/credentials/oauthclient/659112718098-i3u6g3s46vv5tccjvjcsfhrfta3omdvc.apps.googleusercontent.com?project=effective-relic-136507). Remember to hit **Save**!

## Gotchas

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
