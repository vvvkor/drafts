/*
+ open by button like link (or any elenent)
+ active state of links
+ scoped js
+ dynamic init
+ dynamic attrs
*/
customElements.define('link-toggle', class extends HTMLElement {
  
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
    // find target
    const q = this.getAttribute('href') || this.querySelector('a[href^="#"]')?.hash
    const target = (q ? document.querySelector(q) : null ) || this.closest('modal-dialog')
    if (!target) return
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('clicktoggle', {detail: {target: '#' + target.id}}))
    /*
    const id = target.id
    e.preventDefault()
    // open target
    target.hasAttribute('open')
      ? target.removeAttribute('open')
      : target.setAttribute('open', '')
    */
  }
  
})
