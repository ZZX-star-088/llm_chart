import MarkdownIt from "markdown-it";
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value
      } catch (error) {
        console.log(`代码${lang}高亮失败`, error)
      }
    }
    // 没有指定语言或高亮失败时，转义后返回原始代码
    return md.utils.escapeHtml(str)
  }
})

export function renderMarkdown(text) {
  if (!text) return ''
  return md.render(text)
}

export default md
