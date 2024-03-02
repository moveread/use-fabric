patch:
  rm -drf dist
  yarn run build
  npm publish ||(yarn version --patch && npm publish)