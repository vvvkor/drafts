// UMD pattern
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

const tools = (() => {
  
  function packPath (s) {
    return s
      .replace(/\s+/gs, ' ')
      .replace(/^\s+|\s+$/gs, '')
      .replace(/\s?([a-z\-])\s?/g, '$1')
  }

  function pathString (s) {
    return packPath(s.replace(/^.*?"(.*)".*?$/s, '$1'))
  }

  function formatPath (s) {
    return pathString(s)
      .replace(/(z)/gi, '$1\n')
      .replace(/([macql])/gi, '\n$1')
      .replace(/^\s+/, '')
  }

  function iconClass (n, def='icon-x', trim=false) {
    return ([...n.classList].find(v => v.match(/icon-/)) || def).slice(trim ? 5 : 0)
  }

  function setIconClass (n, c) {
    const i = iconClass(n, '')
    if (i) n.classList.replace(i, c)
    else n.classList.add(c)
  }

  function switchIconClass (n) {
    if (!n.dataset.act) return
    if (!n.dataset.inact) n.dataset.inact = iconClass(n)
    n.classList.toggle('act')
    setIconClass(n, n.dataset[n.classList.contains('act') ? 'act' : 'inact'])
  }

  function encodeSvg(svg) {
    return svg.replace('<svg', (~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
      .replace(/"/g, '\'')
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/\{/g, '%7B')
      .replace(/\}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
  }
  
  function insertSymbols(symbols) {
    return `<span hidden><svg>${symbols.join('\n\n')}</svg></span>`
  }
  
  function useSvg (id) {
    return `<svg><use href="#${id}"/></svg>`
  }

  function copyToClipboard (text) {
    console.log('copy', text)
    const a = document.createElement('textarea')
    a.textContent = text
    a.style.position = 'fixed' // prevent scrolling
    document.body.appendChild(a)
    a.select()
    try { return document.execCommand('copy') }
    catch (e) { return prompt('Copy to clipboard: Ctrl+C, Enter', text) }
    finally { document.body.removeChild(a) }
  }
  
  function previewIcon (n, k, w, p, ic, s) {
    if (k == 'inline' || k == 'path') setPath(n, w, p)
    else if (k == 'svg') n.innerHTML = s
    else if (k == 'symbol') n.innerHTML = insertSymbols([s]) + useSvg(ic)
    else if (k == 'url') n.src = s
    else if (k == 'bg' || k =='clip') n.style = s
  }

  function setPath (n, w, p) {
    n.style.setProperty('--w', w)
    n.style.setProperty('--p', 'path("' + p + '")')
  }

  function inlineIcon (w, p) {
    return '--w:' + w + ';--p:path("' + p + '");}'
  }

  function pathIcon (w, p, cls='icon-x') {
    return '.' + cls + ' {--w:' + w + ';--p:path("' + p + '");}'
  }

  function svgIcon (w, p, id, sz=false) {
    return '<svg xmlns="http://www.w3.org/2000/svg"' + (sz ? ' width="' + sz + '" height="' + sz + '"' : '') + ' viewBox="0 0 ' + w + ' ' + w + '"><path d="' + p + '"/></svg>'
  }

  function symbolIcon (w, p, id) {
    return '<symbol id="' + id + '" viewBox="0 0 ' + w + ' ' + w + '"><path d="' + p + '"/></symbol>'
  }

  function urlIcon (w, p) {
    return 'data:image/svg+xml;utf8,' + encodeSvg(svgIcon(w, p))
  }

  function bgIcon (w, p) {
    return `background-image:url("${urlIcon(w, p)}");`
  }

  function clipIcon (w, p) {
    return `mask-image:url("${urlIcon(w, p)}");`
  }
  
  return {
    packPath,
    formatPath,
    iconClass,
    setIconClass,
    switchIconClass,
    copyToClipboard,
    //insertSymbols,
    //useSvg,
    setPath,
    previewIcon,
    
    icon: {
      path: pathIcon,
      inline: inlineIcon,
      svg: svgIcon,
      symbol: symbolIcon,
      url: urlIcon,
      bg: bgIcon,
      clip: clipIcon,
    },
  }
})()

    return tools;
}));