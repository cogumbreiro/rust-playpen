#!/bin/dash

set -o errexit
java -jar "$1" -
printf '\377' # 255 in octal
#echo "Protocol is well-formed!"

