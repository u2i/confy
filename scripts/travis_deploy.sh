#!/bin/bash

if [ -n "$TRAVIS_TAG" ]; then
  gcloud auth activate-service-account --key-file gcloud_credentials.json
  docker tag confy:"$CONFY_VERSION" gcr.io/kubernetes-playground-195112/confy:"$CONFY_VERSION"
  gcloud docker -- push gcr.io/kubernetes-playground-195112/confy:"$CONFY_VERSION"
fi
