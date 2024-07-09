(function() {

const styleTemplate = document.createElement('template');
styleTemplate.innerHTML =
`<style>
.gallery {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: var(--gallery-margin-top);
  margin-bottom: var(--gallery-margin-top);
  margin-left: var(--gallery-margin-left);
  margin-right: var(--gallery-margin-left);
}
.gallery .media-wrapper {
  display: block;
  padding: 0;
}
.gallery img, .gallery iframe, .gallery lite-vimeo {
  display: block;
  width: 100%;
  height: 100%;
}
.gallery .media-wrapper {
  position: relative;
}
.gallery .media-wrapper .media-overlay {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
</style>`;

const template = document.createElement('template');
template.innerHTML =
`<div class="media-wrapper">
    <div class="media-overlay">
        <slot name="overlay></slot>
    </div>
    <slot class="main-slot"></slot>
</div>`;

class GalleryItem extends HTMLElement {
  constructor() {
    super();

    this.appendChild(template.content.cloneNode(true));
    this._slot = this.querySelector('.main-slot');
  }

  connectedCallback() {

  }
}

customElements.define('gallery-item', GalleryItem);
})();