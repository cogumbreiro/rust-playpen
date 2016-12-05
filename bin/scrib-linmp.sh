#!/bin/dash

set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT
#java -jar "$1" - > $out

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

CLASSPATH='/home/scribble/lib/antlr-runtime-3.2.jar:/home/scribble/lib/antlr.jar:/home/scribble/lib/antlr-runtime.jar:/home/scribble/lib/commons-io.jar:/home/scribble/lib/scribble-cli.jar:/home/scribble/lib/scribble-core.jar:/home/scribble/lib/scribble-parser.jar:/home/scribble/lib/stringtemplate.jar:/home/scribble/lib/linmp-scala.jar'

#java -cp "$CLASSPATH" main.Main /home/scribble/tmp/tmp.scr $2 > $out
java -cp "$CLASSPATH" main.Main '-inline' "$tmp" "$2" > $out

printf '\377' # 255 in octal
#echo "Protocol is well-formed!"
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
 then 
	echo "Protocol is well-formed!"
fi
