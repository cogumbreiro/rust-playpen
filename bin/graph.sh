#!/bin/sh

#dash
#set -o errexit
#out=$(mktemp)
#trap "rm -f $out" EXIT
#java -jar "$1" - -dot "$2" "$3" > $out
#printf '\377' # 255 in octal
#cat $out


# Directory containing Scribble jars
LIB=lib

# antlr 3.2 location (if no lib jar)
ANTLR=
  # e.g. '/cygdrive/c/Users/[User]/.m2/repository/org/antlr/antlr-runtime/3.2/antlr-runtime-3.2.jar'

PRG=`basename "$0"`
#DIR=`dirname "$0"`   # Non Cygwin..
DIR="/home/scribble"
#BASEDIR=$(dirname $0)

set -o errexit
out=$(mktemp)
trap "rm -f out" EXIT

tmp=$(cat)
echo "$tmp" > /home/scribble/tmp/tmp.scr

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


CMD='java -cp '$CLASSPATH' org.scribble.cli.CommandLine'

eval $CMD /home/scribble/tmp/tmp.scr -nomodnamecheck -fsm "$2" "$3" > $out

printf '\377' # 255 in octal
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
then 
  echo "Protocol is well-formed!"
fi
