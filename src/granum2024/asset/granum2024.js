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

const tab = (n, e) => {
  if (e) e.preventDefault()
  const ul = n.closest('.tabs')
  ul.nextElementSibling.querySelectorAll(':scope > [id]').forEach(d => d.classList[d.id == n.hash.slice(1) ? 'add' : 'remove']('show'))
  ul.querySelectorAll('a[href^="#"]').forEach(a => a.classList[a == n ? 'add' : 'remove']('act'))
}

const foc = (e) => {
  const m = location.hash ? document.querySelector(location.hash)?.closest('.modal') : null
  if (m && !m.matches(':focus-within')) ((e?.type || !location.hash ? null : m.querySelector(location.hash)) || m.querySelector('button,input,select,textarea,[contenteditable]' + (e?.type == 'focusin' ? ',[href],[tabindex]:not([tabindex="-1"])' : '')))?.focus()
}

const dlg = e => {
  const n = document.querySelector(location.hash)
  const m = document.querySelector('dialog[open]:not([popover])')
  if (m && !m.contains(n)) m.close()
  if (n && n.matches('dialog:not([popover])')) n.showModal()
}

document.addEventListener('DOMContentLoaded', e => {
  document.body.classList.add('js')
  
  // restore inputs/details
  document.querySelectorAll('.mem[id], form.mem [id]').forEach(n => {
    const v = localStorage.getItem('val-' + n.id)
    if (v == null) return
    if (n.matches('details')) n.open = !!v
    else if (['checkbox', 'radio'].includes(n.type)) n.checked = (v == n.value)
    else n.value = v
  })
  
  // use URL params
  const u = new URL(location.href)
  document.querySelectorAll('[data-get]:not(form), form[data-get] [name]').forEach(n => {
    const v = u.searchParams.getAll(n.dataset.get || n.name)
    if (v.length < 1) return
    if (['checkbox', 'radio'].includes(n.type)) n.checked = v.includes(n.value)
    else if (n.matches('input,textarea,select')) n.value = v.join(', ')
    else n.innerHTML = v.join(', ') // n.textContent
  })
  
  // align table cells
  document.querySelectorAll('table').forEach(n => {
    (n.className.match(/\b[lcr]\d\d?\b/g) || [])
    .forEach(c => {
      n.querySelectorAll('tr>*:nth-child(' + c.slice(1) + ')')
      .forEach(td => td.classList.add(c.slice(0, 1)))
    })
  })
  
  // init toggle classes
  document.querySelectorAll('[data-nodes]').forEach(n => cls(n))

  // init toggle
  document.querySelectorAll('[href="#open"]').forEach(n => tgl(n))
  document.querySelectorAll('.tabs').forEach(t => tab(t.querySelector('a[href^="#"]')))
  
  // remove title on [data-hint]
  document.querySelectorAll('[data-hint]').forEach(n => n.removeAttribute('title'))

  // open dialog by hash
  dlg()
  
  // set focus
  setTimeout(foc, 100)
})

document.addEventListener('click', e => {
  const n = e.target
  const a = n.closest('a, button')
  
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

  if (a) {
    
    // prev/next
    if (location.hash && ['#prev', '#next'].includes(a.hash)) {
      e.preventDefault()
      const id = document.querySelector(location.hash)?.dataset[a.hash == '#prev' ? 'prev' : 'next']
      if (id) location.hash = id
    }
    
    //go back
    else if (a.hash == '#back') {
      e.preventDefault()
      history.go(-1)
    }
    
    //open
    else if (a.hash == '#open') tgl(a, e)
    else if (a.closest('.tabs')) tab(a, e)

    // confirm or prompt link
    else if (a.classList.contains('dialog')) {
      e.preventDefault()
      const t = a.title || a.textContent
      const h = a.href || a.dataset.href
      if (!h) return alert(t)
      const uu = new URL(location.href)
      const u = new URL(h || '#cancel', location.href)
      const p = a.dataset.prompt
      const v = p
        ? prompt(t, uu.searchParams.get(p) || a.dataset.def || u.searchParams.get(p) || '')
        : (confirm(t) ? 1 : null)
      if (v != null) {
        u.searchParams.set(p || a.dataset.param || 'confirm', v)
        if (a.matches('[target="_blank"], [data-blank]')) window.open(u)
        else location.href = u
      }
    }
    
    // copy to clipboard
    else if (a.classList.contains('copy')) {
      const n = document.querySelector(a.hash)
      if (n) {
        e.preventDefault()
        n.select()
        if (document.execCommand('copy') && !a.classList.contains('act')) {
          a.classList.add('act')
          setTimeout(() => a.classList.remove('act'), 3000)
        }
      }
    }
    
    // show password
    else if (a.classList.contains('pass')) {
      const n = document.querySelector(a.hash)
      if (n) {
        e.preventDefault()
        a.classList.toggle('act')
        n.type = a.classList.contains('act') ? 'text' : 'password'
      }
    }
    
  }
})

document.addEventListener('input', e => {
  const n = e.target
  
  // store inputs
  if (n.id && (n.classList.contains('mem') || n.form?.classList.contains('mem'))) {
    if (n.type == 'radio') (n.closest('form') || document).querySelectorAll(`[type="radio"][name="${n.name}"][id]`).forEach(m => localStorage.removeItem('val-' + m.id))
    localStorage.setItem('val-' + n.id, (['checkbox', 'radio'].includes(n.type) && !n.checked) ? '' : n.value)
  }
  
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

document.addEventListener('toggle', ({target: n}) => {
  // store details
  if (n.matches('details') && n.id && n.classList.contains('mem')) localStorage.setItem('val-' + n.id, n.open ? 1 : '')
}, true)

// open dialog by hash
window.addEventListener('hashchange', dlg)
window.addEventListener('close', e => (e.target.id == location.hash.slice(1)) ? location.hash = '#close' : null, true)

/* old-style modals and popups */

document.addEventListener('keydown', e => {
  // close modals and popups
  if (e.key == 'Escape') {
    location.hash = '#escape'
    document.querySelectorAll('details.pop').forEach(n => n.removeAttribute('open'))
  }
})

/*
document.addEventListener('focus', e => {
  const p = e.target.closest('.pop')
  if (p) p.dispatchEvent(new Event('mouseover'))
})

document.addEventListener('blur', e => {
  const p = e.target.closest('.pop')
  if (p && p._win) p._win.classList.add('hide')
})
*/

document.addEventListener('mouseover', e => {
  // fix popup position, allow overflow
  const w = e.target.closest?.('.popwin')
  //const n = e.target.closest?.('.pop:not(details)')
  const n = e.target.closest?.('.pop.pos')
  const p = n ? n.querySelector(':scope > *+:last-child') : null
  if (!w) document.querySelectorAll('.popwin').forEach(p => p.classList.add('hide'))
  if (p && !n._win) {
    n._win = p
    p.classList.add('popwin')
    document.body.append(p)
  }
  if (n && n._win) {
    const b = n.getBoundingClientRect()
    n._win.style.cssText = ''
    if (b.left + b.right < window.innerWidth) n._win.style.left = b.left + 'px'
    else n._win.style.right = (document.documentElement.clientWidth - b.right) + 'px'
    if (b.top + b.bottom < window.innerHeight) n._win.style.top = b.bottom + 'px'
    else n._win.style.bottom = (document.documentElement.clientHeight - b.top) + 'px'
    n._win.classList.remove('hide')
  }
})

// trap focus in modal
document.addEventListener('focusin', foc)
window.addEventListener('hashchange', foc)

})()