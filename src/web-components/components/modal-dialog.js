/*
+ initial state from url hash
+ initial state from [open]
+ onhashchange
+ click out a.backdrop
- esc
+ auto-open parents
+ auto-close children and others
- safe backdrop
- ! fix js backdrop
- smart overflow
- popups outside
- expand horizontally to max-width
- scroll: keep header and footer
*/
customElements.define('modal-dialog', class extends HTMLElement {
  
  static observedAttributes = ['open'];
  
  constructor () {
    super()
	}

  connectedCallback () {
    //this.setAttribute('js', '')
    this.toggle(location.hash)
    window.addEventListener('hashchange', this)
    window.addEventListener('clicktoggle', this)
    window.addEventListener('subtoggle', this)
  }

  disconnectedCallback () {
    window.removeEventListener('hashchange', this)
    window.removeEventListener('clicktoggle', this)
    window.removeEventListener('subtoggle', this)
  }
  
  handleEvent (e) {
    this[`on${e.type}`](e)
  }
  
  attributeChangedCallback(name, ov, nv) {
    if (name == 'open') {
      window.dispatchEvent(new CustomEvent('togglemodal', {detail: {target: '#' + this.id}}))
      console.log((nv == null) ? 'close' : 'open', this.id)
    }
  }
  
  onclicktoggle (e) {
    this.toggle(e.detail.target, e.detail.on)
  }
  
  onsubtoggle (e) {
    this.toggle(e.detail.target, e.detail.on, true)
  }
  
  onhashchange (e) {
    if (location.hash.length > 1) this.toggle(location.hash, true)
  }
  
  toggle (target, on, quiet) {
    if (this.id && target == '#' + this.id) {
      if (on == null) on = !this.hasAttribute('open')
      if (on) this.setAttribute('open', '')
      else this.removeAttribute('open')
      this.updateSources()
      if (!quiet || !on) this.updateHash() // does not trigger hashchange event
      if (!quiet) this.updateModals() // open parents of close submodals
    }
  }
  
  updateModals () {
    const on = this.hasAttribute('open')
    // close children
    if (!on) this.querySelectorAll('modal-dialog[open]').forEach(m => window.dispatchEvent(new CustomEvent('subtoggle', {detail: {target: '#' + m.id, on: false}})))
    else {
      document.querySelectorAll('modal-dialog').forEach(m => {
        // skip self
        if (m == this) ;
        // open parents, close others
        else window.dispatchEvent(new CustomEvent('subtoggle', {detail: {target: '#' + m.id, on: m.contains(this)}}))
      })
    }
    this.parents(this.parentNode).filter(n => n.matches('modal-dialog:not([open])')).forEach(m => window.dispatchEvent(new CustomEvent('subtoggle', {detail: {target: '#' + m.id, on: true}})))
  }
  
  parents (n) {
    return (n.parentElement ? this.parents(n.parentElement) : []).concat([n])
  }
  
  updateHash () {
    const on = this.hasAttribute('open')
    let h = null
    if (on && location.hash != '#' + this.id) h = '#' + this.id
    else if (!on && location.hash == '#' + this.id) h = location.href.replace(/#.*$/, '')
    if (h) history.pushState({}, '', h) // does not trigger hashchange event
  }
  
  updateSources () {
    document.querySelectorAll('link-toggle[href="#' + this.id + '"], link-toggle:has([href="#' + this.id + '"])')
      .forEach(a => a.classList.toggle('act', this.hasAttribute('open')))
  }
  
})
