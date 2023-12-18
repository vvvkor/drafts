customElements.define('mark-down', class extends HTMLElement {
  /*
  constructor () {
    super()
	}
  */
  connectedCallback () {
    //this.setAttribute('js', '')
    // +h1, +p, +ul, +ol, +hr, +bq, +pre, +br, +a, +img, +a>img, +b, +i, +code, +autolink
    
    this.innerHTML = this.textContent
      .split(/[\r\n]{2,}/)
      // blocks
      .map(p => {
        p = p.trim()
        if (p.match(/^\-{3,}$/)) return '<hr>'
        else if (p.slice(0, 2) == '- ') return '<ul>' + p.replace(/^- (.+)$/gm, '<li>$1</li>') + '</ul>'
        else if (p.slice(0, 3) == '1. ') return '<ol>' + p.replace(/^\d+\. (.+)$/gm, '<li>$1</li>') + '</ol>'
        else if (p.slice(0, 2) == '> ') return '<blockquote><p>' + p.replace(/^> (.+)$/gm, '$1') + '</p></blockquote>'
        else if (p.slice(0, 3) == '```') return '<pre>' + p.replace(/(^`+|`+$)/g, '').replace(/  [\r\n]/g, '\n').trim() + '</pre>'
        else if (p.at(0) == '#') {
          const m = p.match(/^#+/)
          const h = m[0].length
          return `<h${h}>${p.slice(h).trim()}</h${h}>`
        }
        else return `<p>${p}</p>`
      })
      // inline
      .map(p => p
        .replace(/  [\r\n]/g, '<br>')
        .replace(/(\*\*\*|___)(.+?)\1/gs, '<em><strong>$2</strong></em>')
        .replace(/(\*\*|__)(.+?)\1/gs, '<strong>$2</strong>')
        .replace(/(\*|_)(.+?)\1/gs, '<em>$2</em>')
        .replace(/(`)(.+?)\1/gs, '<code>$2</code>')
        .replace(/!\[(.*?)\]\((.+?)(\s"(.+?)")?\)/g, '<img alt="$1" src="$2" title="$4">')
        .replace(/\[(.+?)\]\((.+?)(\s"(.+?)")?\)/g, '<a href="$2" title="$4">$1</a>')
        .replace(/(^|[^"])((https?|mailto):\/\/[^\s"<>]+)/mg, '$1<a href="$2">$2</a>')
      )
      // combine
      .join(' ')
  }
})
