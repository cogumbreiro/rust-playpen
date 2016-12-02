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

echo "$tmp" > /home/scribble-linmp/tmp1.scr
tail -n +2 /home/scribble-linmp/tmp1.scr > /home/scribble-linmp/tmp2.scr

echo 'module tmp;\n' | cat - /home/scribble-linmp/tmp2.scr > /home/scribble-linmp/tmp3.scr && mv /home/scribble-linmp/tmp3.scr /home/scribble-linmp/tmp.scr

java -classpath /home/scribble-linmp/lib/antlr-runtime-3.2.jar:/home/scribble-linmp/lib/antlr.jar:/home/scribble-linmp/lib/antlr-runtime.jar:/home/scribble-linmp/lib/commons-io.jar:/home/scribble-linmp/lib/scribble-cli.jar:/home/scribble-linmp/lib/scribble-core.jar:/home/scribble-linmp/lib/scribble-parser.jar:/home/scribble-linmp/lib/stringtemplate.jar:/home/scribble-linmp/lib/linmp-scala.jar main.Main /home/scribble-linmp/tmp.scr $2 > $out
#/home/scribble-linmp/test/Game3.scr

printf '\377' # 255 in octal
#echo "Protocol is well-formed!"
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
 then 
	echo "Protocol is well-formed!"
fi
