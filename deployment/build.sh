#!/bin/sh

CURR=date
LOG_FILE=build.log
echo "\n\n\n-------------" >> $LOG_FILE
echo "\n\n\nAeris Interactive build on `date`\n\n" >> $LOG_FILE
echo "-------------\n\n\n" >> $LOG_FILE

# Remove existing build directory
if [ -d "$DIRECTORY" ]; then
  echo "Removing ../build directory..."
  rm -r ../build
fi


# Compile compass projects
echo "Compiling compass projects..."
./compileCompassProjects.sh config/themes.conf  >> $LOG_FILE  || { echo "Something went wrong! Check build.log" ; exit 1 ; }




# Grab first argument as the deployed base directory
DEPLOYED_BASE_DIR="$1"
if [ -z $DEPLOYED_BASE_DIR ]
  then
    echo "Error: Must provide a deployment directory."
    exit 2
fi

# Create a backup of the original end.frag.js
mv end.frag.js end.frag.js.bak

# Generate new end.frag.js with the deployment directory filled
echo "Setting deployment directory to $DEPLOYED_BASE_DIR..."
sed "s,{{DEPLOYED_BASE_DIR}},$DEPLOYED_BASE_DIR,g" end.frag.js.bak > end.frag.js




# Run the r.js optimizer
echo "Building application library..."
r.js -o build.js >> $LOG_FILE

echo "Building aeris.Loader..."
r.js -o buildLoader.js >> $LOG_FILE

echo "Building aeris maps packages"
node packageConfigBuilder.js >> $LOG_FILE



# Remove generated files
echo "Removing temporary build files..."
rm end.frag.js

# Restore backup copy of end.frag.js
mv end.frag.js.bak end.frag.js

echo "done."