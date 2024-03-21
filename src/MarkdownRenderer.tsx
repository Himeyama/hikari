// import Showdown from 'react-showdown';
import 'highlight.js/styles/github.css'; // ハイライトのスタイルを選択
import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm'
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

hljs.registerLanguage('c', c);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

const MarkdownRenderer = (props: any) => { 
  // console.log(props.markdown)
  const markdown = props.markdown;
  const marked = new Marked(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const lines = hljs.highlight(code, { language }).value.split("\n");
      const table = document.createElement("table");
      table.className = "hljs-ln";
      const tbody = document.createElement("tbody");
      table.append(tbody);
      for(const line of lines){
        const tr = document.createElement("tr");
        tbody.append(tr);
        const ln = document.createElement("td");
        tr.append(ln);
        const lncode = document.createElement("td");
        tr.append(lncode);
        lncode.innerHTML = line;
      }
      console.log(table.innerHTML);
      console.log(hljs.highlight(code, { language }).value);
      return table.innerHTML;
    }
  }));
  const html = marked.parse(markdown);
  console.log(html)
  if(typeof(html) != "string"){
    return (<div></div>)
  }

  // console.log(html);
  return (
    <div dangerouslySetInnerHTML={{__html: html}} />
  );
};

export default MarkdownRenderer;