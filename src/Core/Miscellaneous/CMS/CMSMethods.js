import React from 'react';

import HtmlToReact, {Parser} from 'html-to-react';

import AsyncComponent from 'AsyncComponent';

//simply returns a true Bool for the unprocessed elements
const isValidNode = () => true;

//processes string and returns react node elements
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

//rules to process the nodes
const processingInstructions = [
{
    //conditions for special processing
    shouldProcessNode(node) {
        return node && node.name && (node.name.indexOf('replacesnippetwith') > -1 || node.name == 'script');
    },
    //what to do with the special nodes
    processNode(node, children) {
        let Node = null;

        switch (node.name) {
          case 'replacesnippetwithtwig':
            Node = AsyncComponent(() => import('ReplaceSnippetWithTwig'))
            break;
          case 'replacesnippetwithhtml':
            Node = AsyncComponent(() => import('ReplaceSnippetWithHtml'))
            break;
          case 'script':
            //import scripts declared from CMS
            const script = document.createElement("script");

            if (node.attribs.src) script.src = node.attribs.src;
            script.async = false;
            if (node.children.length) script.innerHTML = node.children[0].data;
            if (!node.attribs.src) {
              setTimeout(function(){
                document.head.appendChild(script);
              }, 1500);
            } else {
              document.head.appendChild(script);
            }

            return <div key={getRandomInteger(0, 500)}></div>
            break;
        }

        return <Node {...node.attribs} />

    }
},
{
   // Anything else
    shouldProcessNode(node) {
        return true;
    },
    processNode: processNodeDefinitions.processDefaultNode
}];

//returns and renders processed nodes with the above methods
const compileTemplate = template => {
   const htmlToReactParser = new Parser();

   return htmlToReactParser.parseWithInstructions(template, isValidNode, processingInstructions);
}

//returns random keys for react nodes
const getRandomInteger = (min = 0, max = 500) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//replaces snippets name from CMS templates
const replaceSnippet = (content, callback = () => {}) => {
    //extracts the snippet name
    return content.replace(/__snippet::(.*)__/g, function(match){
        let snip = match.split('__snippet::').pop().split('__').shift();
        //checks if template is custom in order to render different components
        return snip.indexOf('setter') >= 0 ?
             `<ReplaceSnippetWithHtml key='${getRandomInteger(0, 500)}' name='${snip}' />`
             : `<div><ReplaceSnippetWithTwig key='${getRandomInteger(0, 500)}' name='${snip}' /></div>`
    })

}


export {compileTemplate, replaceSnippet};
