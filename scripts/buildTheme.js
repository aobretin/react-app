'use strict';

const fs = require('fs');
const path = require('path');
const aliases = require('../config/aliases');

const THEME = 'DefaultTemplate';
const RELATIVE_URL = `../src/Themes/${THEME}/Components`;

fs.stat(`src/Themes/${THEME}`, (err, stat) => {
  let themeSchemaURL = '';

  if (err == null) {
    themeSchemaURL = `src/Themes/${THEME}/ThemeSchema.js`;
  } else if(err.code == 'ENOENT') {
    themeSchemaURL = 'src/Themes/Default/ThemeSchema.js';
  }

  fs.readFile(themeSchemaURL, 'utf8', (err, data) => {
    if (err) return console.error(`Failed with error ${err}`);

    let processedAliases = {};
    let themeSchema = JSON.parse(data);

    fs.readFile(path.join(__dirname, '../config/theme.js'), 'utf8', (err, data) => {
      if (err) return console.error(`Failed reading with error ${err}`);
        let update = null;
        let configFile = {};

        Object.keys(themeSchema.Aliases).forEach(alias => processedAliases[alias] = path.resolve(__dirname, `${RELATIVE_URL}/${themeSchema.Aliases[alias]}`));
        configFile.services = themeSchema.Services.slice();
        configFile.MobileBreakpoint = themeSchema.MobileBreakpoint;
        configFile.HotelSeparateDetailsPage = themeSchema.HotelSeparateDetailsPage;

        processedAliases = Object.assign({}, aliases, processedAliases);
        update = data.replace(/\{(\s*?.*?)*?\}/g, JSON.stringify(processedAliases, null, 2));

        fs.writeFile(path.join(__dirname, '../config/theme.js'), update, 'utf-8', err => {
          if (err) return console.log(err);
        });

        fs.writeFile(path.join(__dirname, '../src/Config.json'), JSON.stringify(configFile, null, 2), 'utf-8', err => {
          if (err) return console.log(err);
        });
    });
  });
});
