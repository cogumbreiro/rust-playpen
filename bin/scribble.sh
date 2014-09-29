#!/bin/dash

set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT
java -jar /homes/tsoaresc/Work/scribble-java/scribble.jar - > $out
printf '\377' # 255 in octal
cat $out

