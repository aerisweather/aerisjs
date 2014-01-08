#!/bin/sh


logSeparator() {
  logWhitespace
  log "---------------------"
  logWhitespace
}

logWhitespace() {
  log "\n\n"
}

logAndOutput() {
  log "$1"
  echo "$1"
}

log() {
  echo $1 >> $LOG_FILE
}