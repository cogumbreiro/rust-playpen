#!/bin/dash
set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT
JAR=/homes/tsoaresc/Work/scribble-java/scribble.jar
java -jar "$JAR" - -project "$1" "$2" > $out
printf '\377' # 255 in octal
cat $out

