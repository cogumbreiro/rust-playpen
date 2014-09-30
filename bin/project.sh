#!/bin/dash
set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT
java -jar "$1" - -project "$2" "$3" > $out
printf '\377' # 255 in octal
cat $out

