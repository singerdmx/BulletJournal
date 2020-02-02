#!/bin/sh

GOOD=true

if [ -z "$ORIGIN_URL" ]; then
  unset GOOD
fi

if [ -z "$PROXY_URL" ]; then
  unset GOOD
fi

if [ -z "$SSO_SECRET" ]; then
  unset GOOD
fi

if [ -z "$SSO_URL" ]; then
  unset GOOD
fi

if [ -z "$GOOD" ]; then
  echo "#!/bin/sh"
  echo
  echo "# you are going to need to set the following env vars and run"
  echo "# the image like this"
  echo
  echo "ORIGIN_URL=http://somesite.com"
  echo "SSO_SECRET=somesecret"
  echo "SSO_URL=http://someurl"
  echo "HOST_PORT=3001"
  echo
  echo "docker run -d --restart=always -e ORIGIN_URL=\$ORIGIN_URL -e PROXY_URL=http://0.0.0.0:80 -e SSO_SECRET=\$SSO_SECRET -e SSO_URL=\$SSO_URL -p \$HOST_PORT:80 discourse/discourse-auth-proxy"
else
  exec /bin/discourse-auth-proxy
fi
