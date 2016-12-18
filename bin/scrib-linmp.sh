#!/bin/dash

set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT

#tmp=''
#while read line
#	do
#		  tmp=$tmp$line'\n'
#			done < /dev/stdin
#tmp='module tmp;\n'$(cat)
tmp=$(cat)

#echo "$tmp" > /home/scribble/tmp/tmp1.scr
#tail -n +2 /home/scribble/tmp/tmp1.scr > /home/scribble/tmp/tmp2.scr
#
#echo 'module tmp;\n' | cat - /home/scribble/tmp/tmp2.scr > /home/scribble/tmp/tmp3.scr && mv /home/scribble/tmp/tmp3.scr /home/scribble/tmp/tmp.scr

#echo "$tmp" > /home/scribble/tmp/tmp.scr

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
CLASSPATH=$CLASSPATH':'$DIR'/'$LIB'/linmp-scala.jar'

#java -cp "$CLASSPATH" main.Main /home/scribble/tmp/tmp.scr $2 > $out
java -cp "$CLASSPATH" main.Main -inline "$tmp" "$2" > $out

printf '\377' # 255 in octal
#echo "Protocol is well-formed!"
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
 then 
	echo "Protocol is well-formed."
fi
