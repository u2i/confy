#!/bin/bash

if [ -n "$TRAVIS_TAG" ]; then
  gcloud auth activate-service-account --key-file gcloud_credentials.json
  docker tag confy:"$TRAVIS_TAG" gcr.io/kubernetes-playground-195112/confy:"$TRAVIS_TAG"
  gcloud docker -- push gcr.io/kubernetes-playground-195112/confy:"$TRAVIS_TAG"
fi
