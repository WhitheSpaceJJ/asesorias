const template = document.createElement('template')

class TurnarTabs extends HTMLElement {
 // #tabs = ['asesorado', 'asesoria', 'detalles']
  //#activeTab

  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true)
    )

    this.btnAsesorado = this.shadowRoot.getElementById('btn-asesorado')
    this.btnDomicilio = this.shadowRoot.getElementById('btn-domicilio')
    this.btnTurno = this.shadowRoot.getElementById('btn-turno')
 //   this.#activeTab = 'asesorado'

    this.addClickEventListeners()
  }

  connectedCallback() {
    document.addEventListener('next', event => {
      const tabId = event.detail.tabId
      this.handleTabClick(tabId)
    })
  }

  addClickEventListeners() {
    this.btnAsesorado.addEventListener('click', () =>
      this.handleTabClick('asesorado')
    )
    this.btnDomicilio.addEventListener('click', () =>
      this.handleTabClick('domicilio')
    )
    this.btnTurno.addEventListener('click', () => this.handleTabClick('turno'))
  }

  handleTabClick(tabId) {
    this.showTabSection(tabId)
    this.dispatchEventTabChangeEvent(tabId)
    this.updateAriaAttributes(tabId)
  }

  showTabSection(tabId) {
   // this.#activeTab = tabId
    const tabSections = document.querySelectorAll(
      'asesorado-tab, domicilio-tab, turno-tab'
    )
    tabSections.forEach(section => {
      section.style.display = 'none'
    })

    let tabToDisplay
    tabSections.forEach(section => {
      return section.id === tabId && (tabToDisplay = section)
    })
    tabToDisplay.style.display = 'block'
  }
  /*
  verifyChange = tabId => {
  if (tabId === this.#activeTab) {
      return 'No se puede cambiar a la misma pestaña'
    }
    if (!this.#tabs.includes(tabId)) return 'La pestaña no existe'

    const asesoradoTab = document.querySelector('asesorado-full-tab')
    const asesoriaTab = document.querySelector('asesoria-tab')
   
    if (
      tabId === this.#tabs[1] &&
      (!asesoradoTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }
    if (
      tabId === this.#tabs[2] &&
      (!asesoradoTab.isComplete || !asesoriaTab.isComplete)
    ) {
      return 'No se puede cambiar de pestaña si no se han completado los datos'
    }

  }
    */


  dispatchEventTabChangeEvent(tabId) {
  //  const msg = this.verifyChange(tabId)
  //  if (msg) throw new Error(msg)

    const event = new CustomEvent('tab-change', {
      bubbles: true,
      composed: true,
      detail: { tabId },
    })
    this.dispatchEvent(event)
  }

  updateAriaAttributes(activeTab) {
    const tabs = ['btn-asesorado', 'btn-domicilio', 'btn-turno']
    tabs.forEach(tab => {
      const isSelected = tab === `btn-${activeTab}`
      this.shadowRoot
        .getElementById(tab)
        .setAttribute('aria-selected', isSelected)
    })
  }
}

const html = await (await fetch('../assets/turnar/tabs.html')).text()
template.innerHTML = html

customElements.define('turnar-tabs', TurnarTabs)
