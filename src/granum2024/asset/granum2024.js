/*! granum2024.js */
(() => {
  
const act = (n, k, f) => (n.dataset.parent ? n.closest(n.dataset.parent) : document)?.querySelectorAll(n.dataset[k]).forEach(m => f(m))
const cls = n => {
  if (n.type == 'checkbox') act(n, 'nodes', m => m.classList[n.checked != ('reverse' in n.dataset) ? 'add' : 'remove'](...n.value.split(/\s+/)))
  else if ((n.type == 'radio' && n.checked) || n.options) act(n, 'nodes', m => m.className = n.value)
}
const tgl = (n, e) => {
  const d = n.closest('li').querySelector('ul')
  if (d) {
    if (e) {
      e.preventDefault()
      d.classList.toggle('hide')
    }
    n.classList[d.classList.contains('hide') ? 'remove' : 'add']('act')
  }
}
/*
const tgl2 = (n, e) => {
  const d = (n.hash == '#open')
    ? n.closest('li').querySelector('ul')
    : document.querySelector(n.hash)
  if (d) {
    if (e) {
      e.preventDefault()
      d.classList.toggle('hide')
    }
    else {
      if (d.classList.contains('target')) {
        d.classList.add('hide')
        d.classList.remove('target')
      }
    }
    (d.id ? document.querySelectorAll('[href="#' + d.id + '"]') : [n])
      .forEach(m => m.classList[d.classList.contains('hide') ? 'remove' : 'add']('act'))
  }
}
*/

document.addEventListener('DOMContentLoaded', e => {
  document.body.classList.add('js')
  
  // use URL params
  const u = new URL(location.href)
  document.querySelectorAll('[data-get]:not(form), form[data-get] [name]').forEach(n => {
    const v = u.searchParams.getAll(n.dataset.get || n.name)
    if (v.length < 1) return
    if (['checkbox', 'radio'].includes(n.type)) n.checked = v.includes(n.value)
    else if (n.matches('input,textarea,select')) n.value = v.join(', ')
    //else n.textContent = v.join(', ')
    else n.innerHTML = v.join(', ')
  })
  
  // init toggle classes
  document.querySelectorAll('[data-nodes]').forEach(n => cls(n))

  // init toggle
  document.querySelectorAll('[href="#open"]').forEach(n => tgl(n))
  //document.querySelectorAll('[href="#open"], a.toggle').forEach(n => tgl2(n))
  
  // remove title on [data-hint]
  document.querySelectorAll('[data-hint]').forEach(n => n.removeAttribute('title'))
})

document.addEventListener('click', e => {
  const n = e.target
  
  // sort table
  const h = n.closest('.sort th, th.sort')
  if (h && !n.closest('a, input, [name]')) {
    const i = h.cellIndex
    const b = h.closest('thead').nextElementSibling
    if (b.rows.length > 1) {
      const c = h.closest('table').dataset.sort || 'info'
      const x = [...b.rows].map(m => [m, m.cells[i].textContent.replace(/\s+$/, '')]).map(m => [m[0], m[1], parseFloat(m[1])])
      const k = isNaN(x[0][2]) ? 1 : 2
      const r = h.classList.contains(c) ? (x[0][k] < x[x.length-1][k] ? -1 : 1) : 1
      x.sort((a, b) => a[k] < b[k] ? -r : (a[k] > b[k] ? r : 0))
      x.forEach(m => b.append(m[0]))
      ;[...h.parentNode.children].forEach(m => m.classList.toggle(c, m == h))
    }
  }

  // prev/next
  else if (location.hash && ['#prev', '#next'].includes(n.hash)) {
    e.preventDefault()
    const id = document.querySelector(location.hash)?.dataset[n.hash == '#prev' ? 'prev' : 'next']
    if (id) location.hash = id
  }
  
  //go back
  else if (n.hash == '#back') {
    e.preventDefault()
    history.go(-1)
  }
  
  //open
  else if (n.hash) tgl(n, e)
  //else if (n.matches('[href="#open"], a.toggle')) tgl2(n, e)

})

document.addEventListener('input', e => {
  const n = e.target
  
  // check all boxes
  if (n.dataset.check) act(n, 'check', m => m.checked = n.checked && !m.closest('[hidden]'))
  
  // toggle classes
  if (n.dataset.nodes) cls(n)

  // filter table
  if (n.dataset.filter) act(n, 'filter', t => t.querySelectorAll('tbody tr')
    .forEach(m => m.hidden = !(' ' + m.textContent.replace(/\s+/g, ' ') + ' ').match(new RegExp(n.value, 'i'))))
  
  // map contenteditable to textarea
  const a = n.dataset.area
  if (a) document.querySelector(a).value = n.innerHTML

  // map area to contenteditable
  const c = n.dataset.editor
  if (c) document.querySelector(c).innerHTML = n.value
})

document.addEventListener('keydown', e => {
  // close modals and popups
  if (e.key == 'Escape') {
    location.hash = '#escape'
    document.querySelectorAll('details.pop').forEach(n => n.removeAttribute('open'))
  }
})


})()