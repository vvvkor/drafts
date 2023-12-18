;(() => {

let { signal, component, focus, render } = reef

customElements.define('reef-list', class extends HTMLElement {
  constructor () {
    super()
    this.data = signal({items: ['empty']})
    const events = {
      onClick: e => this.data.items[e.target.dataset.index] += '-'
    }
    component(this, this.template.bind(this), {events})
  }
  connectedCallback() {
    this.data.items = [...this.querySelectorAll('li')].map(li => li.textContent)
  }
  template () {
    return `<ul>${this.data.items.map((item, idx) => `<li data-index="${idx}" onclick="onClick">${item}</li>`).join('')}</ul>`
  }
})

})()