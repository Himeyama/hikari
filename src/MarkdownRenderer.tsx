// import Showdown from 'react-showdown';
import 'highlight.js/styles/github.css'; // ハイライトのスタイルを選択
import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

hljs.registerLanguage('c', c);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

const MarkdownRenderer = (props: any) => { 
  return (
    <div>
      <Markdown
        rehypePlugins={[rehypeHighlight]}
      >{props.markdown}</Markdown>
    </div>
  );
};

export default MarkdownRenderer;