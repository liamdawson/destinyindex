const fs = require("fs");
const toml = require("@iarna/toml");
const Handlebars = require("handlebars");
const HtmlMinifier = require('html-minifier');

const templateSource = fs.readFileSync("index.html", "utf8");

const ctx = toml.parse(fs.readFileSync("data.toml", "utf8"));

const languageCodes = ["en"];

const language = "en";

Handlebars.registerHelper(
  "i18n",
  (obj, key) => obj && obj[language] && obj[language][key]
);

const itemHasCategory = category => item =>
  (item.categories || []).indexOf(category) !== -1;

Handlebars.registerHelper("eachItemInCategory", function(category, options) {
  const items = ctx.items.filter(
    item => item.categories && item.categories.indexOf(category) !== -1
  );

  if (items && items.length) {
    return items
      .map(options.fn)
      .reduce((a, b) => a + b);
  }

  return "";
});

Handlebars.registerHelper("stringify", (obj) => JSON.stringify(obj, undefined, 2));

languageCodes.forEach(code => {
  fs.writeFileSync(
    "build/" + code + "/index.html",
    HtmlMinifier.minify(Handlebars.compile(templateSource)(ctx), {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      sortAttributes: true,
      sortClassName: true
    })
  );
});
