#!/bin/dash

set -o errexit
java -jar /homes/tsoaresc/Work/scribble-java/scribble.jar -
printf '\377' # 255 in octal
echo "Protocol is well-formed!"

