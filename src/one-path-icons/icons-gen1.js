import tools from './icons-tools1.js'

function initEditor (n) {
  //ePreview.classList.replace(iconClass(ePreview), iconClass(n))
  const c = tools.iconClass(n)
  eName.textContent = c
  tools.setIconClass(ePreview, c)
  tools.setIconClass(ePreviewHead, c)
  tools.setIconClass(eResult_path, c)
  tools.setIconClass(eResult_inline, c)
  const s = window.getComputedStyle(n)
  const w = s.getPropertyValue('--w')
  const p = s.getPropertyValue('--p')
  eSource.innerText = '--w: ' + w + '\n--p: ' + p
  eWidth.value = w
  ePath.value = tools.formatPath(p)
}

function updatePreview (e) {
  const w = eWidth.value
  const p = tools.packPath(ePath.value)
  const ic = tools.iconClass(ePreview)
  
  // bg grid
  const q = 100 / w;
  ePreview.style.setProperty('--bgs',`${q}% ${q}%`)

  // big preview
  tools.setPath(ePreview, w, p)
  tools.setPath(ePreviewHead, w, p)
  
  // formats
  const formats = ['path', 'inline', 'svg', 'symbol', 'url', 'bg', 'clip']
  formats.forEach(k => {
    const s = tools.icon[k](w, p, ic)
    tools.previewIcon(window['eResult_' + k], k, w, p, ic, s)
    window['eOutput_' + k].innerText = s
    window['eOutput_' + k + '_length'].innerText = s.length
  })
  
  
  // length
  eSymbols.textContent = 'input: ' + ePath.value.length + ', packed: ' + p.length + ', css: ' + eOutput_path.innerText.length
}

document.addEventListener('DOMContentLoaded', e => {
  [...document.querySelectorAll('.icons [class*="icon-"]')].forEach((n, i) => {
    const ic = tools.iconClass(n, '', true)
    n.title = '' + (1 + i) + '. ' + ic
    n.classList.add('pad', 'hover', 'c')
    n.dataset.hint = n.title
    n.addEventListener('click', e => {
      if (e.ctrlKey) tools.switchIconClass(e.target)
      initEditor(e.target)
      updatePreview()
    })
    const hint = document.createElement('span')
    hint.textContent = ic // n.title
    n.append(hint)
    ePath.addEventListener('input', updatePreview)
    eWidth.addEventListener('input', updatePreview)
  })
  
  document.addEventListener('click', e => {
    const copy = e.target.matches('a.copy[href*="#"]')
    if (copy) {
      const src = document.querySelector(e.target.hash)
      if (src) {
        e.preventDefault()
        const c = tools.copyToClipboard(src.innerText)
        e.target.querySelectorAll('.status').forEach(n => {
          n.classList.add(...(c ? ['icon-check', 'status-success'] : ['icon-ban', 'status-danger']))
          setTimeout(() => n.className = '', 2000)
        })
      }
    }
  }, true)
  
  iconMenu.click()
})

