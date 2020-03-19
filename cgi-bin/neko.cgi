#!/bin/sh


. ./config.cgi

writeAccessLog() {
  accessDate=`date +"%Y/%m/%d_%H:%M:%S"`
  echo "$accessDate $REMOTE_ADDR $REQUEST_URI $1">> ../log/access.log
}

if expr "$1" : "[0-9a-zA-Z]\\{1,255\\}$" >/dev/null; then
  echo "Content-type:text/html; charset=UTF-8"
  echo ""
#  cat "$formatDir""format.html" | sed -e "s/__memoName__/$1/g"
  cat "$formatDir""format.html"
  writeAccessLog accept
else
  echo "Status: 418"
  echo "Content-type:text/plain; charset=UTF-8"
  echo ""
  echo "だめなのじゃ"
  writeAccessLog denied
fi
