const template = document.createElement('template');
template.innerHTML = 
`<style>
.header {
    margin: 0;
    padding: 25.5px;
    display: flex;
    flex-direction: column;
    z-index: 2;
    background-color: var(--website-background-color);
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
    color: var(--background-color-major);
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
nav ul {
    padding: 0px;
    margin: 0px;
}
nav li {
    display: inline;
}
nav a {
    display: inline-block;
    margin: 4px 2px;
}
nav .button {
    padding: 6px 18px;
}

@media only screen and (max-width: 768px) {
    .header {
        position: fixed;
        width: 100%;
        padding: 0px;
        top: 0px;
    }
    .banner {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px 20px;
    }
    nav {
        margin: 0px;
    }
    nav a {
        margin: 4px 0px;
    }
    nav ul {
        margin: 0px 0px 10px 0px;
    }
    nav .button {
        border-radius: 0px;
    }
    .nav li {
        display: inline-block;
        width: 100%;
    }
    .mobile-expand-lbl {
        display: block;
        top: 2px;
        position: relative;
        float: right;
    }
    #mobile-expand-content {
        max-height: 0px;
    }
    .nav a {
        width: 100%;
    }
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
        <ul class="nav" id="id_nav">
        <slot></slot>
        </ul>
      </div>
    </nav>
</div>`

const liTemplate = document.createElement('template');
liTemplate.innerHTML =
`<li><a><div class="button"></div></a></li>`;

class CollapsibleNav extends HTMLElement {
    constructor() {
        super();

        this._onScroll = this._onScroll.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this._navRoot = this.shadowRoot.querySelector('.header');
        this._navCollapsible = this.shadowRoot.querySelector('.mobile-expand');

        Promise.all([
            customElements.whenDefined('collapsible-nav-li'),
          ])
            .then(_ => this._populateNav());
    }

    connectedCallback() {
        this._prevScrollPosition = window.scrollY;

        window.addEventListener("scroll", this._onScroll);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this._onScroll);
    }

    _populateNav() {
        let lis = Array.from(this.querySelectorAll('collapsible-nav-li'));
        lis.forEach((li) => {
            li._populateHtml();
        });
    }

    _onScroll() {
        let diff = window.scrollY - this._prevScrollPosition;
        console.log(window.scrollY);
        if (diff < -5 || window.scrollY < 44) {
        // TODO: need to not hardcode this!!!
          this._navRoot.style.top = "0px";
        } else if (diff > 0) {
          this._navRoot.style.top = "-44px";
          this._navCollapsible.checked = false;
        }
        this._prevScrollPosition = window.scrollY;
    }
}

customElements.define("collapsible-nav", CollapsibleNav);

class CollapsibleNavLi extends HTMLElement {
    static observedAttributes = ["href", "active"];

    constructor() {
        super();
    }

    attributeChangedCallback() {
        if (!this._buttonDiv || !this._link)
        {
            return;
        }

        this._link.href = href;

        if (active)
        {
          this._buttonDiv.classList.add('active');
        }
        else
        {
          this._buttonDiv.classList.remove('active');
        }
    }

    _populateHtml() {
        let innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.appendChild(liTemplate.content.cloneNode(true));
        this._buttonDiv = this.querySelector('.button');
        this._link = this.querySelector('a');
        
        this._buttonDiv.innerHTML = innerHTML;

        this._upgradeProperty('active');
        this._upgradeProperty('href');
    }

    set href(value) {
        this.setAttribute('href', value);
        this._link.setAttribute('href', value);
    }
  
    get href() {
        return this.hasAttribute('active');
    }

    set active(value) {
        value = Boolean(value);
        if (value)
        {
          this.setAttribute('active', '');
        }
        else
        {
          this.removeAttribute('active');
        }
    }
  
    get active() {
        return this.hasAttribute('active');
    }

    _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
            let value = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }
}

customElements.define("collapsible-nav-li", CollapsibleNavLi);
