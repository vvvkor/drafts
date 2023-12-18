customElements.define('sort-list', class extends HTMLElement {
  
  constructor () {
    super()
    this.addEventListener('click', this)
	}
  
  /*
  connectedCallback () {
    //this.setAttribute('js', '')
    this.addEventListener('click', this)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this)
  }
  */
  handleEvent (e) {
    this[`on${e.type}`](e)
  }
  
  onclick (e) {
    const btn = e.target.closest('[data-sort]')
    if (btn) {
      const ul = this.querySelector('ul')
      if (ul) {
        const num = this.hasAttribute('numeric')
        const dir = (btn.dataset.sort == 'desc') ? -1 : (btn.dataset.sort == 'toggle' && this.getAttribute('order') == 'asc' ? -1 : 1)
        this.setAttribute('order', dir < 0 ? 'desc' : 'asc')
        const cmp = num
          ? (a, b) => (parseFloat(a.textContent) - parseFloat(b.textContent)) * dir
          : (a, b) => (a.textContent < b.textContent ? -1 : 1) * dir
        const list = [...ul.children].sort(cmp)
        list.forEach(li => ul.append(li))
      }
    }
  }
  
})
