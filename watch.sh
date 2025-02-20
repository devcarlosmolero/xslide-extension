while true; do
  inotifywait -r -e modify,create,delete ./xslide-extension-dist
  cp -r ./xslide-extension-dist /media/sf_GUEST/
done
