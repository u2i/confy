FROM ruby:2.3.0

RUN mkdir -p /srv/www/web
WORKDIR /srv/www/web

ADD . /srv/www/web

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN bundle install
RUN npm install --unsafe-perm
RUN RAILS_ENV=production rake assets:precompile
