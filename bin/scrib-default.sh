#!/bin/sh

set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT

tmp=$(cat)
#echo "$tmp" > /home/scribble/tmp/tmp.scr

CLASSPATH='/home/scribble/lib/antlr-runtime-3.2.jar:/home/scribble/lib/antlr.jar:/home/scribble/lib/antlr-runtime.jar:/home/scribble/lib/commons-io.jar:/home/scribble/lib/scribble-cli.jar:/home/scribble/lib/scribble-core.jar:/home/scribble/lib/scribble-parser.jar:/home/scribble/lib/stringtemplate.jar:/home/scribble/lib/linmp-scala.jar'

java -cp "$CLASSPATH" org.scribble.cli.CommandLine '-inline' "$tmp" > $out

printf '\377' # 255 in octal
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
then 
  echo "Module (all protocols) well-formed."
fi

