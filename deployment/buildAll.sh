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

# Copy assets
mkdir -p ../build/cdn.aerisjs.com
cp -r ../assets ../build/cdn.aerisjs.com

# Copy aeris.js
cp ../build/cdn.aerisjs.com/gmaps-plus.js ../build/cdn.aerisjs.com/aeris.js
cp ../build/cdn.aerisjs.com/gmaps-plus.min.js ../build/cdn.aerisjs.com/aeris.min.js