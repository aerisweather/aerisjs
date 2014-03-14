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

  node scripts/generatepublicdocs.js ../src themes/public public/index.html >> $LOG_FILE

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
}

copyGeneratedDocs() {
  mkdir -p ../build/docs.aerisjs.com
  mkdir -p ../build/docs.aerisjs.com/api
  mkdir -p ../build/docs.aerisjs.com/assets

  cp -r public/index.html ../build/docs.aerisjs.com/index.html
  cp -r api ../build/docs.aerisjs.com
  cp -r assets ../build/docs.aerisjs.com
}

logHeader
compileCompassProjects
generatePublicDocs
generateApiDocs
generateMarkdownDocs
copyGeneratedDocs
logBuildComplete
