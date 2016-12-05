#!/bin/sh

#dash
#set -o errexit
#out=$(mktemp)
#trap "rm -f $out" EXIT
#java -jar "$1" - -dot "$2" "$3" > $out
#printf '\377' # 255 in octal
#cat $out

set -o errexit
out=$(mktemp)
trap "rm -f out" EXIT

tmp=$(cat)

DIR='/home/scribble'
LIB='lib'
#CLASSPATH=$DIR'/modules/cli/target/classes/'
#CLASSPATH=$CLASSPATH':'$DIR'/modules/core/target/classes'
#CLASSPATH=$CLASSPATH':'$DIR'/modules/parser/target/classes'
#CLASSPATH=$CLASSPATH':'$ANTLR
#CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/antlr.jar'
CLASSPATH=$DIR'/'$LIB'/antlr.jar'
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/antlr-runtime.jar'
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/commons-io.jar'
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/scribble-cli.jar'
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/scribble-core.jar'
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/scribble-parser.jar'
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/stringtemplate.jar'


#CMD='java -cp '$CLASSPATH' org.scribble.cli.CommandLine'
#eval $CMD /home/scribble/tmp/tmp.scr -minlts -nomodnamecheck -fsm "$2" "$3" > $out

java -cp "$CLASSPATH" org.scribble.cli.CommandLine -inline "$tmp" -fsm "$2" "$3" > $out

printf '\377' # 255 in octal
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
then 
  echo "Protocol is well-formed!"
fi
