'use strict';
const fs = require('fs');
const path = require('path');
const aliases = require('../config/aliases');

const THEME = 'Default';
const RELATIVE_URL = `../src/Themes/${THEME}/Components`;

let alreadyImported = [];
let imports = '';

const recursiveImports = (component, imports, alreadyImported) => {
  if (alreadyImported.indexOf(component.Name) == -1) {
    imports += "import " + component.Name + " from '" + component.Name + "';\n"
    alreadyImported.push(component.Name)
  }

  if (typeof component.Children !== 'undefined') {
    let children = component.Children

    return children.map(child => recursiveImports(child, imports, alreadyImported))
  }

  return imports;
}

const recursiveAliases = (component, aliases) => {
  if (!aliases.hasOwnProperty(component.Name)) aliases[component.Name] = path.resolve(__dirname, `${RELATIVE_URL}/${component.Path}`)

  if (typeof component.Children !== 'undefined') {
    let children = component.Children

    return children.map(child =>  recursiveAliases(child, aliases))
  }

  return aliases;
}

const recursiveChildren = (component, template) => {
  if (typeof component.Children !== 'undefined') {
    let children = component.Children;

    return template =
    `
      <${component.Name}>
        ${children.map(child => recursiveChildren(child, template))}
      </${component.Name}>
    `
  }

  return `<${component.Name}/>\n`;
}

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

        let appFile =
          `import React from 'react';
           import {Route, Switch} from 'react-router-dom';
          ${
            Object.keys(themeSchema).map(block => {
              return themeSchema[block].Components.map(component => {
                recursiveAliases(component, processedAliases)

                return recursiveImports(component, imports, alreadyImported)
              })
            })
          }

          const App = () => {
            return (
              <div>
                ${
                  Object.keys(themeSchema).map((block, blockIdx) => {
                    let template = ''

                    switch(block) {
                      case 'Header':
                      case 'Footer':
                        themeSchema[block].Components.forEach(component => {
                          template = recursiveChildren(component, template)
                        })

                        return template
                        break
                      case 'Body':
                        template += "<Switch>\n"

                        themeSchema[block].Components.forEach((component, idx) => {
                          template +=
                          idx === 0
                          ?
                            "<Route exact path='" + component.RouterPath + "' component={" + component.Name + "} />\n"
                          :
                            "<Route path='" + component.RouterPath + "' component={" + component.Name + "} />\n"
                        })

                        template += "<Route render={() => <h1>Not found</h1>} />\n"
                        template += "</Switch>\n"

                        return template
                        break
                    }
                  })
                }
              </div>
            )
          }

          export default App;`

        processedAliases = Object.assign({}, aliases, processedAliases);
        update = data.replace(/\{(\s*?.*?)*?\}/g, JSON.stringify(processedAliases, null, 2));
        appFile = appFile.replace(/[,]/g, '');

        console.log(appFile.replace(/^[,]/g, ''))

        fs.writeFile(path.join(__dirname, '../config/theme.js'), update, 'utf-8', err => {
          if (err) return console.log(err);
        });

        fs.writeFile(path.join(__dirname, '../src/App.js'), appFile, 'utf-8', err => {
          if (err) return console.log(err);
        })
    });
  });
});
