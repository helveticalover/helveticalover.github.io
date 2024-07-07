(function() {
const template = document.createElement('template');
template.innerHTML = 
`<style>
.center {
    margin-left: 0;
    margin-right: 0;
    text-align: center;
    width: 100%;
}
.header {
    margin: 0;
    padding: 25.5px;
    display: flex;
    flex-direction: column;
    z-index: 2;
    background-color: var(--header-background-color, rgba(0, 0, 0, 0));
    transition: top .25s ease-in-out;
}
.mobile-expand {
    display: none;
}
.mobile-expand-lbl {
    display: none;
    cursor: pointer;
    transition: all 0.25s ease-out;
}
.mobile-expand-lbl:hover {
    color: var(--nav-icon-color-hover);
}
#mobile-expand-content {
    max-height: auto;
    overflow: hidden;
    transition: max-height .25s ease-in-out;
}
.mobile-expand:checked ~ #mobile-expand-content {
    max-height: 100vh;
}
.menu-icon {
    display: inline-flex;
    height: 32px;
    width: auto;
    margin: auto;
    align-items: center;
}
.menu-icon > * {
    height: 100%;
    width: auto !important;
    max-width: 100%;
    max-height: 100%;
}
nav {
    margin: 10px 0px 20px 0px;
}
.nav {
    padding: 0px;
    margin: 0px;
}

.collapsed.header {
    position: fixed;
    width: 100%;
    padding: 0px;
    top: 0px;
}
.collapsed .banner {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 20px;
}
.collapsed nav {
    margin: 0px;
}
.collapsed .nav {
    margin: 0px 0px 10px 0px;
}
.collapsed .mobile-expand-lbl {
    display: block;
    top: 2px;
    position: relative;
    float: right;
}
.collapsed #mobile-expand-content {
    max-height: 0px;
}
</style>
<div class="header">
    <nav class="center">
      <input id="id_nav-collapsible" class="mobile-expand" type="checkbox">
      <div class="banner">
        <slot name="title">Title</slot>
        <div style="width: 100%;">
          <label for="id_nav-collapsible" class="mobile-expand-lbl" data-target="id_nav">
            <slot name="nav-icon" class="menu-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="48" width="48" viewBox="0 0 48 48"><path d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z"/></svg>
            </slot>
          </label>
        </div>
      </div>
      <div id="mobile-expand-content">
        <div class="nav" id="id_nav">
        <slot></slot>
        </div>
      </div>
    </nav>
</div>`

class CollapsibleNav extends HTMLElement {
    static get observedAttributes() {
        return ['collapse-width'];
    }
  
    constructor() {
        super();

        this._onScroll = this._onScroll.bind(this);
        this._onResize = this._onResize.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._navRoot = this.shadowRoot.querySelector('.header');
        this._navCollapsible = this.shadowRoot.querySelector('.mobile-expand');
        this._setCollapseWidth(this.getAttribute("collapse-width"));
    }

    connectedCallback() {
        this._prevScrollPosition = window.scrollY;

        window.addEventListener("scroll", this._onScroll);
        window.addEventListener("resize", this._onResize);
    }

    attributeChangedCallback() {
        this._setCollapseWidth(this.getAttribute("collapse-width"));
      }

    disconnectedCallback() {
        window.removeEventListener("scroll", this._onScroll);
        window.removeEventListener("resize", this._onResize);
    }

    _setCollapseWidth(value) {
        this._collapseWidth = Number(value);
        this._onResize();
    }

    _onResize() {
        if (window.innerWidth <= this._collapseWidth)
        {
            this._navRoot.classList.add("collapsed");
        }
        else
        {
            this._navRoot.classList.remove("collapsed");
        }
    }

    _onScroll() {
        let diff = window.scrollY - this._prevScrollPosition;
        console.log(window.scrollY);
        if (diff < -5 || window.scrollY < 44) {
        // TODO: need to not hardcode this!!!
          this._navRoot.style.top = "0px";
        } else if (diff > 0) {
          this._navRoot.style.top = "-46px";
          this._navCollapsible.checked = false;
        }
        this._prevScrollPosition = window.scrollY;
    }
}

customElements.define("collapsible-nav", CollapsibleNav);
})();
