#!/bin/sh

LOG_FILE=build.log
BUILD_CONFIG=$1
COMPASS_THEMES_CONF="config/themes.conf"

. scripts/logger.sh
. scripts/command.sh


main() {
  logHeader
  compileCompassProjects "$COMPASS_THEMES_CONF"
  optimizeReqJSPackage "$BUILD_CONFIG"
  logBuildComplete
}

logHeader() {
  logSeparator
  log "Aeris Interactive build on `date`"
  log "using build config: $BUILD_CONFIG"
  logSeparator
}

logBuildComplete() {
  logSeparator
  logAndOutput "Aeris Interactive build successfully completed."
  logSeparator
}

compileCompassProjects() {
  CONFIG_FILE=$1

  logAndOutput "Compiling compass projects..."

  while read -r p; do
    if [[ "$p" != *#* ]]; then
      COMPILE_TARGET="../lib/${p/$'\n'/}"
      COMPILE_CMD="compass compile $COMPILE_TARGET"
      COMPILE_ERROR="Failed to compile $COMPILE_TARGET"

      log "compiling $COMPILE_TARGET..."
      executeBuildCommand "$COMPILE_CMD" "$COMPILE_ERROR"
    fi
  done < "$CONFIG_FILE"

  logAndOutput "done."
}

optimizeReqJSPackage() {
  CONF_FILE=$1
  RJS_CMD="r.js -o $CONF_FILE"
  ERROR_MSG="Failed to run r.js optimizer, using the $CONF_FILE build configuration"

  logAndOutput "Building application library..."
  executeBuildCommand "$RJS_CMD" "$ERROR_MSG"
  logAndOutput "done."
}

main
exit 0