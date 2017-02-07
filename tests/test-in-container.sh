#!/usr/bin/env bash
# Run tests inside a docker container.
#
# Note that you will need docker installed for this to work.
#
# Why?
#   we've been having trouble getting tests to run in PhantomJS, outside a Linux environment.
#   This script will run your code in Linux container, and reinstall PhantomJS within that container.
docker run \
  -v `pwd`:/opt/aerisjs \
  node:6.9.5 \
  bash -c "cd /opt/aerisjs && npm uninstall grunt-jasmine-legacy && npm install grunt-jasmine-legacy && npm test"