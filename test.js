var fetchUrl = require("fetch").fetchUrl;
var _ = require("lodash");

const compareHierarchy = function(a, b, path = []) {
  let hasErrors = false;
  const pathString = path.join(".") || "()";

  if (typeof a === typeof b) {
    if (typeof a === "string") {
      return false;
    }

    if (typeof a === "object") {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);

      const onlyA = _.difference(aKeys, bKeys);
      if (onlyA.length) {
        const list = onlyA.join(", ");
        console.error(
          `\x1b[32m\x1b[1m${pathString}\x1b[0m →  \x1b[31mleft only\x1b[0m → \x1b[33m\x1b[1m${list}\x1b[0m`
        );
        hasErrors = true;
      }

      const onlyB = _.difference(bKeys, aKeys);
      if (onlyB.length) {
        const list = onlyB.join(", ");
        console.error(
          `\x1b[32m\x1b[1m${pathString}\x1b[0m → \x1b[31mright only\x1b[0m → \x1b[33m\x1b[1m${list}\x1b[0m`
        );
        hasErrors = true;
      }

      const both = _.intersection(aKeys, bKeys);
      both.forEach(
        key => (hasErrors |= compareHierarchy(a[key], b[key], [...path, key]))
      );
    }
  } else {
    console.error(
      `\x1b[32m\x1b[1m${pathString}\x1b[0m → \x1b[31mleft type:\x1b[0m \x1b[33m\x1b[1m${typeof a}\x1b[0m vs. \x1b[31mright type:\x1b[0m \x1b[33m\x1b[1m${typeof b}\x1b[0m`
    );
    hasErrors = true;
  }

  return hasErrors;
};

fetchUrl(`https://unpkg.com/@vue/cli-ui@latest/locales/en.json`, function(
  error,
  meta,
  body
) {
  const en = JSON.parse(body.toString());
  const de = require("./locales/de.json");

  const result = compareHierarchy(en, de);
  process.exit(result);
});
