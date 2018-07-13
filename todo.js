var fetchUrl = require("fetch").fetchUrl;
var _ = require("lodash");
const fs = require('fs');
const path = require('path');
const { sortedJSON } = require('./utils');

const markDeprecated = function(obj) {
    if (typeof obj === 'string') {
        if (!/^DEPRECATED /.test(obj)) {
            obj = `DEPRECATED ${obj}`
        }
    } else if (typeof oldValue === 'object') {
      Object.keys(obj).forEach(key => obj[key] = markDeprecated(obj[key]));
    }

    return obj;
}

const todoCopy = function(from, to) {
  if (typeof from === typeof to && typeof from === 'object') {
      const fromKeys = Object.keys(from);
      const toKeys = Object.keys(to);

      const newKeys = _.difference(fromKeys, toKeys);
      newKeys.forEach(key => {
          const newValue = from[key];
          if (typeof newValue === 'string') {
              to[key] = `TODO ${newValue}`;
          } else if (typeof newValue === 'object') {
              to[key] = todoCopy(newValue, {});
          }
      })

      const oldKeys = _.difference(toKeys, fromKeys);
      oldKeys.forEach(key => to[key] = markDeprecated(to[key]));

      const bothKeys = _.intersection(fromKeys, toKeys);
      bothKeys.forEach(key => {
        to[key] = todoCopy(from[key], to[key]);
      });
  }

  return to;
};


fetchUrl(`https://unpkg.com/@vue/cli-ui@latest/locales/en.json`, function(
  error,
  meta,
  body
) {
  const filepath = path.resolve(path.relative(__dirname, "./locales/de.json"));
  const base = JSON.parse(body.toString());

  let locale = require(filepath);
  locale = todoCopy(base, locale);

  let json = JSON.stringify(locale, sortedJSON, 2) + "\n";
  fs.writeFileSync(filepath, json, 'utf8');
});
