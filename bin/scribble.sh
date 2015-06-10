#!/bin/dash

set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT
java -jar scribble-tool.jar SMTP.scr > $out
printf '\377' # 255 in octal
#echo "Protocol is well-formed!"
n=$(cat $out | wc -l)
cat $out
echo $n
if [ $n -eq 0 ]
 then 
	echo "Protocol is well-formed!"
fi
