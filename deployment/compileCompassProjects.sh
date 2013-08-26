# Grab first argument as a list of compass project locations
if [ -z $1 ] ; then
  echo "Must provide a configuration file with a list of compass project directories"
  exit 1
fi

PROJECT_DIR_CONF=$1
[ -f $PROJECT_DIR_CONF ] || { echo "Configuration file not found" ; exit 1 ; }

while read -r p; do
  if [[ "$p" != *#* ]]; then
    echo "compiling ../lib/${p/$'\n'/}"
    compass compile ../lib/${p/$'\n'/}
  fi
done < "$PROJECT_DIR_CONF"