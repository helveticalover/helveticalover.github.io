(function() {
class Gallery extends HTMLElement {
  static get observedAttributes() {
    return ['target-height'];
  }

  constructor() {
    super();

    this._onResize = this._onResize.bind(this);
    this._resizeObserver = new ResizeObserver(() => {
      this._onResize();
    });

    this._targetHeight = 500;
    this._lastRowAllowance = 200;
    this._galleryItems = Array();
  }

  connectedCallback() {
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this._resizeObserver.disconnect();
  }

  attributeChangedCallback() {
    const newTargetHeight = Number(this.getAttribute('target-height'));
    if (!isNaN(newTargetHeight))
    {
      this._targetHeight = newTargetHeight;
      this._sizeGalleryItems();
    }
  }

  notifyItemChanged() {
    this._cacheGalleryItems();
  }

  _onResize() {
    this._sizeGalleryItems();
  }

  _cacheGalleryItems() {
    this._galleryItems = Array();
    const items = this.children;
    for (const item of items)
    {
        if (item.tagName === 'HORIZONTAL-FILL-GALLERY-ITEM')
            {
                this._galleryItems.push({
                    wrapper: item,
                    media: item.querySelector('[data-width][data-height]'),
                });
            }
    }
    this._sizeGalleryItems();
  }

  _sizeGalleryItems()
  {
      let rect = this.getBoundingClientRect();
      let R;
      if (rect.width)
      {
          R = Math.floor(rect.width);
      }
      else
      {
          R = Math.floor(rect.right - rect.left);
      }

      let sumr = [];
      sumr[0] = {
          sum: 0,
          media: [],
      };
      let dat = sumr[sumr.length - 1];

      let deviation = Number.MAX_VALUE;

      this._galleryItems.forEach((item) => {
        const wrapper = item.wrapper;
        const md = item.media;
        const h = md.dataset.height;
        const w = md.dataset.width;
        const w_h = w / h;

        // Try add image to existing row
        dat.sum += w_h;
        dat.media.push({
            content: md,
            wrapper: wrapper,
        });
        this._calculateScaledRows(sumr, R);

        let samples = sumr.map((dat) => dat.scaledHeight);
        let newDeviation = this._getDeviation(samples, this._targetHeight);

        // If adding image to row increases deviation, add it to new row
        if (newDeviation > deviation)
        {
            dat.sum -= w_h;
            dat.media.pop();

            dat = {};
            dat.sum = w_h;
            dat.media = [{
                content: md,
                wrapper: wrapper,
            }];
            sumr.push(dat);

            this._calculateScaledRows(sumr, R);
            samples = sumr.map((dat) => dat.scaledHeight);
            newDeviation = this._getDeviation(samples, this._targetHeight);
        }

        deviation = newDeviation;
      });

      if (dat.scaledHeight - this._targetHeight > this._lastRowAllowance)
      {
          dat.scaledHeight = this._targetHeight + this._lastRowAllowance;
      }
      this._scaleRowsToTarget(sumr);
  }

  _calculateScaledRows(rows, R)
  {
      for (let dat of rows)
      { 
          let margin = this._parseSize(this._getItemMargin().left);
          let R_1 = R - 2 * (dat.media.length - 1) * margin;

          for (let md of dat.media)
          {
              let h = md.content.dataset.height;
              let w = md.content.dataset.width;

              let num = R_1 * w;
              let div = h * dat.sum;
              let w_1 = Math.floor(num / div);
              let h_1 = Math.floor(w_1 * h / w);
              dat.scaledHeight = h_1;
          }
      }
  }

  _scaleRowsToTarget(rows)
  {
      let margin = this._getItemMargin();
      for (let j = 0; j < rows.length; j++)
      { 
          let dat = rows[j];
          for (let i = 0; i < dat.media.length; i++)
          {
              let md = dat.media[i];
              let scaledHeight = dat.scaledHeight;
              md.wrapper.style.height = scaledHeight + "px";
              md.wrapper.style.width = (scaledHeight * md.content.dataset.width / md.content.dataset.height) + "px";
              md.wrapper.style.marginLeft = (i == 0 ? "0px" : margin.left);
              md.wrapper.style.marginRight = (i == dat.media.length - 1 ? "0px" : margin.left);
              md.wrapper.style.marginTop = (j == 1 ? "0px" : margin.top);
              md.wrapper.style.marginBottom = (j == rows.length ? "0px" : margin.top);
          }
      }
  }

  _getItemMargin()
  {
      let marginLeft = getComputedStyle(document.documentElement).getPropertyValue('--gallery-item-margin-left');
      let marginTop = getComputedStyle(document.documentElement).getPropertyValue('--gallery-item-margin-top');
      return {
          top: marginTop ? marginTop : "0px",
          left: marginLeft ? marginLeft : "0px",
      };
  }

  _parseSize(str)
  {
      str = str.replace(/\s/g, "");
      str = str.replace(/[A-Za-z]+$/g, "");
      return parseInt(str);
  }

  _getMaxImageHeight()
  {
      let vh = getComputedStyle(document.documentElement).getPropertyValue('--gallery-image-max-height');
      vh = vh.replace(/\s/g, "")
      vh = vh.replace(/[A-Za-z]+$/g, "");
      vh = parseInt(vh);
      return Math.round(window.innerHeight / (100 / vh));
  }

  _getMean(samples)
  {
      let sum = 0;
      let N = samples.length;
      for (let x of samples)
      {
          sum += x;
      }
      return sum / N;
  }

  _getDeviation(samples, mean)
  {
      let denom = samples.length;
      let deviation = 0;
      for (let x of samples)
      {
          deviation = (x - mean) * (x - mean);
      }
      deviation /= (denom - 1);
      return Math.sqrt(deviation);
  }
}

customElements.define('horizontal-fill-gallery', Gallery);

class GalleryItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (this.parentElement)
        {
            if (this.parentElement.tagName === 'HORIZONTAL-FILL-GALLERY')
            {
                this._parent = this.parentElement;
                this._parent.notifyItemChanged();
            }
        }
    }

    disconnectedCallback() {
        if (this._parent)
        {
            this._parent.notifyItemChanged();
            this._parent = undefined;
        }
    }
}

customElements.define('horizontal-fill-gallery-item', GalleryItem);

})();