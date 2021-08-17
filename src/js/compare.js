window.addEventListener('DOMContentLoaded', () => {
  new Compare('.compare-area')
})

class Compare {

  constructor(compareAreaElSel) {
    if(!compareAreaElSel) throw new Error('compareAreaElSel - pass the comparison scope selector');

    this.compareAreaEl = document.querySelector(compareAreaElSel);

    this.productRowEl =  this.compareAreaEl.querySelector('.compare-area__row_product');

    this.productsEls = Array.from(this.productRowEl.querySelectorAll('.compare-area__item'));
    this.offsets = this.productsIds.map((val, index) => index + 1); // Заполнение "карты" смещений (магия закрепа)
    this.pinned = null;

    this.backBtn =  this.compareAreaEl.querySelector('.compare-button_back');
    this.nextBtn =  this.compareAreaEl.querySelector('.compare-button_next');

    this.backBtn.addEventListener('click', () => { this.moveHandler(-1) });
    this.nextBtn.addEventListener('click', () => { this.moveHandler(1) });

    this._hammer = new Hammer.Manager(this.compareAreaEl);
    this._hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }) );
    this._hammer.on('pan', this.panHandler.bind(this));

    this.pinHandlerAssignment()

    this.render();
  }

  get productWidth() {
    return (this.productsEls[0].getBoundingClientRect().width
      + Number(
        window.getComputedStyle(this.productsEls[0]).marginRight.replace(/[^0-9]/g, '')
      )
    );
  }

  get productsIds() {
    return Array.from(this.productRowEl.querySelectorAll('.compare-area__item')).reduce((acc, item) => {
      return [...acc, item.getAttribute('data-product-id')];
    }, [])
  }

  get compareOffset() {
    return this._compareOffset || 0
  }
  set compareOffset(value) {
    let newOffset = value;

    const maxOffset = this.productsIds.length - this.availableCount

    if(newOffset > maxOffset) newOffset = maxOffset
    if(newOffset < 0) newOffset = 0

    this._compareOffset = newOffset;

    this.render();
  }

  get pinnedOffset() {
    return this.offsets[this.productsIds.findIndex(productID => productID === this.pinned)]
  }

  set pinnedOffset(mod) {
    this.offsets[this.productsIds.findIndex(productID => productID === this.pinned)] += mod
  }

  get currentOffsetWidth() {
    if (!this._currentOffsetWidth) this._currentOffsetWidth = 0
    return this._currentOffsetWidth
  }

  set currentOffsetWidth(val) {
    let newOffset = val
    const maxOffset = (this.productsIds.length - this.availableCount ) * this.productWidth

    if(newOffset > maxOffset + 100) newOffset = maxOffset + 100
    if(newOffset < -100) newOffset = -100

    this._currentOffsetWidth = newOffset

    this.offsetHandler(this._currentOffsetWidth)
  }

  get availableCount() {
    return Math.floor(
      this.productRowEl.getBoundingClientRect().width / this.productWidth
    )
  }

  get offsetDelta() {
    if(typeof this.startOffset !== 'number') return 0;

    return this.startOffset - this.currentOffsetWidth
  }

  moveHandler(mod = 0) {
    this.startOffset = this.currentOffsetWidth;
    this.compareOffset += mod;
    this.arrange()
  }

  panHandler(e) {
    if(!this.startOffset)
      this.startOffset = this.currentOffsetWidth;

    this.currentOffsetWidth += -e.velocityX * 15;

    if(e.eventType === 4 || Math.abs(this.offsetDelta) > this.productWidth) {
      this.compareOffset = Math.round(
        this.currentOffsetWidth / this.productWidth
      )
      this.arrange()
    }
  }

  pinHandler(id = null) {
    if(id === this.pinned)
      this.pinned = null
    else
      this.pinned = id

    if (this.pinned) {
      this.offsets[this.productsIds.findIndex(productID => productID === this.pinned)] += this.compareOffset
    }

    this.render()
  }

  offsetHandler() {
    let currentOffset = this.currentOffsetWidth

    this.productRowEl.style.transform = `translateX(${-currentOffset}px)`

    Array.from(this.compareAreaEl.querySelectorAll(`.compare-area__section-row__wrapper`))
      .forEach((el) => {
        if(!el) return;

        el.style.transform = `translateX(${-currentOffset}px)`
      })

    this.productsIds
      .filter((productID) => productID === this.pinned)
      .forEach((productID) => {
        Array.from(this.compareAreaEl.querySelectorAll(`[data-product-id="${productID}"]`))
          .forEach((el) => {
            if(!el) return;

            el.style.transform = `translateX(${currentOffset}px)`
          })
      })
  }

  arrange() {
    if(Math.abs(this.offsetDelta) > 100) {
      const dirLeft = this.offsetDelta < 0;

      const neighIndex = this.offsets.findIndex((val) =>
        Number(val) === this.pinnedOffset + (dirLeft ? 1 : -1)
      )

      const neighID = this.productsIds[neighIndex]

      if(this.productsEls[neighIndex] && neighIndex >= 0) {
        let mod = 0;

        if (dirLeft) {
          mod = -this.productWidth
          this.offsets[neighIndex] -= 1
        } else {
          this.offsets[neighIndex] += 1
        }

        Array.from(this.compareAreaEl.querySelectorAll(`[data-product-id="${neighID}"]`))
          .forEach((el) => {
            if(!el) return;

            el.style.transform = `translateX(${mod}px)`
          })
      }

      this.pinnedOffset = dirLeft ? 1 : -1;

      console.log(this.offsets, this.productsEls)

      delete this.startOffset;
    }
  }

  pinHandlerAssignment() {
    this.productsEls
      .forEach((el) => {
        console.log(el)
        el.querySelector('.compare-pin').addEventListener('click', () => {
          this.pinHandler(el.getAttribute('data-product-id'))
        })
      })
  }

  render() {
    if (this.productsIds.length - this.availableCount - 1 <= this.compareOffset) {
      this.nextBtn.setAttribute('disabled', 'disabled')
    } else {
      this.nextBtn.removeAttribute('disabled', 'disabled')
    }
    if (this.compareOffset === 0) {
      this.backBtn.setAttribute('disabled', 'disabled')
    } else {
      this.backBtn.removeAttribute('disabled', 'disabled')
    }

    Array
      .from(this.compareAreaEl.querySelectorAll('.compare-area__item_pinned'))
      .filter((el) => el.getAttribute('data-product-id') !== this.pinned)
      .forEach((el) => el.classList.remove('compare-area__item_pinned'))

    if(this.pinned) {
      const pinnedEl = this.productRowEl.querySelector(`[data-product-id="${this.pinned}"]`)
      if (!pinnedEl.classList.contains(('compare-area__item_pinned')))
        pinnedEl.classList.add(('compare-area__item_pinned'))
    }

    this.currentOffsetWidth = this.compareOffset * this.productWidth
  }
}
