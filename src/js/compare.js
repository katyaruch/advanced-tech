window.addEventListener('DOMContentLoaded', () => {
  new Compare('.compare-area')
})

class Compare {

  constructor(compareAreaElSel) {
    if(!compareAreaElSel) throw new Error('compareAreaElSel - pass the comparison scope selector');

    this.compareAreaEl = document.querySelector(compareAreaElSel);

    this.productRowEl =  this.compareAreaEl.querySelector('.compare-area__row_product');

    this.productsEls = Array.from(this.productRowEl.querySelectorAll('.compare-area__item'));
    this.pinOffsetsFill()
    this.pinned = null;

    this.backBtn =  this.compareAreaEl.querySelector('.compare-button_back');
    this.nextBtn =  this.compareAreaEl.querySelector('.compare-button_next');

    this.backBtn.addEventListener('click', () => { this.moveHandler(-1) });
    this.nextBtn.addEventListener('click', () => { this.moveHandler(1) });

    this._hammer = new Hammer.Manager(this.compareAreaEl);
    this._hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, pointers: 1, threshold: 10 }) );
    this._hammer.on('pan', this.panHandler.bind(this));

    this.pinHandlerAssignment();
    this.render();

    window.addEventListener('resize', () => {
      this.render();
    })
  }

  get productWidth() {
    return (
      this.productsEls[0].getBoundingClientRect().width
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

    const maxOffset = this.productsIds.length - this.availableCount - 1

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
    return Math.round(this._currentOffsetWidth)
  }

  set currentOffsetWidth(val) {
    let newOffset = val
    const maxOffset = (this.productsIds.length - this.availableCount - 1 ) * this.productWidth

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
    if(e.eventType === 2) {
      this.compareAreaEl.classList.add('pan')
    }

    if(!this.startOffset)
      this.startOffset = this.currentOffsetWidth;

    this.currentOffsetWidth += -e.velocityX * 20;

    if(e.eventType === 4 || Math.abs(this.offsetDelta) > this.productWidth) {
      this.compareAreaEl.classList.remove('pan')
      this.compareOffset = Math.round(
        this.currentOffsetWidth / this.productWidth
      )
      this.arrange()
    }
  }

  pinHandler(id = null, ev) {
    if(id === this.pinned) {
      this.pinned = null
    } else if (id) {
      this._pinStartOffset = this.compareOffset
      this.pinned = id
    }

    if (this.pinned) {
      this.offsets[this.productsIds.findIndex(productID => productID === this.pinned)] += this.compareOffset
    } else
      this.dropTransforms()

    ev.target.classList.toggle('active', !this.pinned)

    this.render()
  }

  offsetHandler() {
    this.productRowEl.style.transform = `translateX(${-this.currentOffsetWidth}px)`

    Array
      .from(this.compareAreaEl.querySelectorAll(`.compare-area__section-row__wrapper`))
      .filter( el => Boolean(el) )
      .forEach((el) => {
        el.style.transform = `translateX(${-this.currentOffsetWidth}px)`
      })

    this.productsIds
      .filter( el => Boolean(el) )
      .filter((productID) => productID === this.pinned)
      .forEach((productID) => {
        Array.from(this.compareAreaEl.querySelectorAll(`[data-product-id="${productID}"]`))
          .forEach((el) => {
            el.style.transform =
              `translateX(${this.currentOffsetWidth - ((this._pinStartOffset || 0) * this.productWidth)}px)`
          })
      })
  }

  arrange() {
    if(Math.abs(this.offsetDelta) > 100) {
      const isDirLeft = this.offsetDelta < 0;

      const neighIndex = this.offsets.findIndex((val) =>
        Number(val) === ((this.pinnedOffset - this._pinStartOffset) + (isDirLeft ? 1 : -1)
      ))

      const neighID = this.productsIds[neighIndex]

      if(this.productsEls[neighIndex] && neighIndex >= 0) {
        let mod = 0;

        if (isDirLeft) {
          mod = -this.productWidth
          this.offsets[neighIndex] -= 1
        } else {
          mod = +this.productWidth
          this.offsets[neighIndex] += 1
        }

        Array
          .from(this.compareAreaEl.querySelectorAll(`[data-product-id="${neighID}"]`))
          .filter( el => Boolean(el) )
          .forEach( el => {
            const curr = Number(el.style.transform.replace(/([^0-9-.])/g, ''))
            el.style.transform = `translateX(${curr + mod}px)`
          })

        this.pinnedOffset = isDirLeft ? 1 : -1;
      }


      delete this.startOffset;
    }
  }

  dropTransforms() {
    Array
      .from(this.compareAreaEl.querySelectorAll(`[data-product-id]`))
      .forEach((el) => {
        if(!el) return;

        el.style.transform = null;
      })
    this.pinOffsetsFill()
  }

  pinOffsetsFill() {
    this.offsets = this.productsIds.map((val, index) => index + 1); // Заполнение "карты" смещений (магия закрепа)
  }

  pinHandlerAssignment() {
    this.productsEls
      .forEach((el) => {
        el.querySelector('.compare-pin').addEventListener('click', (ev) => {
          this.pinHandler(el.getAttribute('data-product-id'), ev)
        })
      })
  }

  render() {
    if (this.productsIds.length - this.availableCount - 1 <= this.compareOffset)
      this.nextBtn.setAttribute('disabled', 'disabled')
    else
      this.nextBtn.removeAttribute('disabled', 'disabled')

    if (this.compareOffset === 0)
      this.backBtn.setAttribute('disabled', 'disabled')
    else
      this.backBtn.removeAttribute('disabled', 'disabled')


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
