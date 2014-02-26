#!/bin/bash

# Build all packages
./build.sh packages/appbuilder/mapapp.js
./build.sh packages/appbuilder/mapapp.min.js
./build.sh packages/gmaps/api.js
./build.sh packages/gmaps/api.min.js
./build.sh packages/gmaps/gmaps.js
./build.sh packages/gmaps/gmaps.min.js
./build.sh packages/gmaps/gmaps-plus.js
./build.sh packages/gmaps/gmaps-plus.min.js
