/* image-slot.js — drag-and-drop image placeholder web component.

   Usage in JSX/HTML:
     <image-slot
       slot-id="p-la-jolla"
       shape="wide"
       caption="La Jolla Cove · dive 1"
       tag="dive"
       grad="linear-gradient(160deg, #0d2a3d, #071a26 65%, #06141d)"
       default-src="Images/IMG_9561.jpg"
     ></image-slot>

   Attributes:
     slot-id     — unique ID, required for localStorage persistence
     shape       — wide | tall | sq | lg  (CSS drives sizing)
     caption     — figcaption text
     tag         — "dive" | "hike" (optional, for filtering)
     grad        — CSS gradient string used as placeholder background
     default-src — path/URL to show when no localStorage image exists;
                   a user-dropped image always takes priority

   React note: observedAttributes + attributeChangedCallback ensure the
   component re-renders if React sets attributes after connecting the node.
*/

class ImageSlot extends HTMLElement {
  static get observedAttributes() {
    return ['slot-id', 'shape', 'caption', 'tag', 'grad', 'default-src'];
  }

  connectedCallback()    { this._render(); }
  attributeChangedCallback() { if (this.isConnected) this._render(); }

  _render() {
    const id         = this.getAttribute('slot-id');
    const shape      = this.getAttribute('shape') || 'sq';
    const caption    = this.getAttribute('caption') || '';
    const grad       = this.getAttribute('grad') ||
                       'linear-gradient(160deg, #1c2e3a, #0c1a22 65%, #060f14)';
    const defaultSrc = this.getAttribute('default-src') || '';

    const stored = id ? localStorage.getItem(`nn-img-${id}`) : null;
    const imgSrc = stored || defaultSrc; // dropped image always wins

    this.innerHTML = `
      <figure class="img-slot img-slot--${shape}" data-has-image="${imgSrc ? 'true' : 'false'}">
        <div class="img-slot__bg" style="background:${grad}">
          ${imgSrc
            ? `<img src="${imgSrc}" alt="${caption}" loading="lazy">`
            : `<span class="img-slot__hint" aria-hidden="true">drop photo</span>`}
        </div>
        ${caption ? `<figcaption class="img-slot__caption">${caption}</figcaption>` : ''}
      </figure>`;

    const fig = this.querySelector('figure');
    const bg  = this.querySelector('.img-slot__bg');

    /* drag-and-drop */
    fig.addEventListener('dragover',  e => { e.preventDefault(); fig.classList.add('drag-over'); });
    fig.addEventListener('dragleave', ()  => fig.classList.remove('drag-over'));
    fig.addEventListener('drop',      e => {
      e.preventDefault();
      fig.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = ev => {
        const url = ev.target.result;
        if (id) {
          try { localStorage.setItem(`nn-img-${id}`, url); } catch (_) { /* quota */ }
        }
        bg.innerHTML = `<img src="${url}" alt="${caption}" loading="lazy">`;
        fig.dataset.hasImage = 'true';
      };
      reader.readAsDataURL(file);
    });
  }
}

customElements.define('image-slot', ImageSlot);
