import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import text from 'highlight.js/lib/languages/plaintext';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('text', text);
hljs.registerLanguage('c', c);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

const MarkdownRenderer = (props: any) => { 
  // console.log(props.markdown)
  const markdown = props.markdown;
  const marked = new Marked(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, _info) {
      const language = hljs.getLanguage(lang) ? lang : 'text';
      const lines = hljs.highlight(code, { language }).value.split("\n");
      const ul = document.createElement("ul");
      let i = 1;
      for(const line of lines){
        const li = document.createElement("div");
        const div = document.createElement("div");
        const ln = document.createElement("div");
        li.className = "hljs-list"
        div.className = "hljs-li";
        ln.className = "hljs-ln";
        li.append(ln);
        ln.innerText = `${i}`;
        li.append(div);
        div.innerHTML = line;
        ul.append(li);
        i += 1;
      }
      return ul.innerHTML;
    }
  }));
  const html = marked.parse(markdown);
  console.log(html)
  if(typeof(html) != "string"){
    return (<div></div>)
  }

  return (
    <div dangerouslySetInnerHTML={{__html: html}} />
  );
};

export default MarkdownRenderer;