#!/bin/bash

files=$(ls)
main=index.html
cat /dev/null > $main
echo '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>DownloadPage</title></head><body><h1>Index</h1><ul>' > $main
for i in $files; do
  if [ $i != 'index.html' ] && [ $i != 'autoIndex.sh' ] && [ $i != 'main.html' ]; then
    echo '<li><a href="'$i'">'$i'</a></li>' >> $main
  fi
done
echo '</ul></body></html>' >> $main
echo 'finished!'