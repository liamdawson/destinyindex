const fs = require('fs');
const toml = require('@iarna/toml');
const Handlebars = require('handlebars');

const templateSource = fs.readFileSync('index.template.html', "utf8");

const data = toml.parse(fs.readFileSync('data.toml', 'utf8'));

const itemHasCategory = (category) => (item) => (item.categories || []).indexOf(category) !== -1;

Handlebars.registerHelper('itemsByCategory', function (category) {
  const allItems = (data.items || []);
  return allItems.filter(itemHasCategory(category));
});

fs.writeFileSync('build/en/index.html', Handlebars.compile(templateSource)(data));