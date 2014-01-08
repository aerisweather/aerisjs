#!/bin/sh

executeBuildCommand() {
  CMD=$1
  ERROR_MSG=$2

  $CMD >> $LOG_FILE || { fatalError "$ERROR_MSG" ; exit 1 ; }
}

fatalError() {
  ERROR_MSG="$1"
  echo "Something went wrong! Check build.log"
  logSeparator
  log "Fatal error: $ERROR_MSG"
  logSeparator

  exit 1
}