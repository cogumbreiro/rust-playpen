#!/bin/dash

set -o errexit
out=$(mktemp)
trap "rm -f $out" EXIT
java -jar "$1" - > $out
printf '\377' # 255 in octal
#echo "Protocol is well-formed!"
n=$(cat $out | wc -l)
cat $out
if [ $n -eq 0 ]
 then 
	echo "Protocol is well-formed!"
fi
