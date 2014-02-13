#!/bin/sh

LOG_FILE=build.log

logAndOutput() {
  log "$1"
  echo "$1"
}

logHeader() {
  logSeparator
  log "Aeris.js docs build on `date`"
  logSeparator
}

logBuildComplete() {
  logSeparator
  logAndOutput "Aeris.js docs build successfully completed."
  logAndOutput "`date`"
  logSeparator
}

logSeparator() {
  logWhitespace
  log "---------------------"
  logWhitespace
}

logWhitespace() {
  log "\n\n"
}

log() {
  echo $1 >> $LOG_FILE
}


compileCompassProjects() {
  logWhitespace
  logAndOutput "Compiling compass projects...."

  log "...api theme..."
  (cd themes/api; compass compile --force) >> $LOG_FILE

  log "...public theme..."
  (cd themes/public; compass compile --force) >> $LOG_FILE

  logAndOutput "done."
}

generatePublicDocs() {
  logWhitespace
  logAndOutput "Generating public API docs..."

  node scripts/generatedocs.js ../lib themes/public public/index.html >> $LOG_FILE

  logAndOutput "done."
}

generateApiDocs() {
  logWhitespace
  logAndOutput "Generating reference API docs..."

  yuidoc -q >> $LOG_FILE

  logAndOutput "done."
}

generateMarkdownDocs() {
  logWhitespace
  logAndOutput "Generating markdown docs..."

  node scripts/generatemarkdowndocs.js themes/markdown ./markdown >> $LOG_FILE

  logAndOutput "done."
}


logHeader
compileCompassProjects
generatePublicDocs
generateApiDocs
generateMarkdownDocs
logBuildComplete
