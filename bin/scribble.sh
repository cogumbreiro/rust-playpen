#!/bin/dash

set -o errexit
java -jar "$1" - > $out
printf '\377' # 255 in octal
#echo "Protocol is well-formed!"
cat $out
