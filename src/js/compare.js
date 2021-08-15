window.addEventListener('DOMContentLoaded', () => {
  new Compare(document.querySelector('.compare-area'))
})

class Compare {
  constructor(compareAreaEl) {
    if(!compareAreaEl) throw new Error('compareAreaEl needed');

    this.productRowEl = compareAreaEl.querySelector('.compare-area__row_product');
    this.specificationRowEl = compareAreaEl.querySelector('.sections-container');

    this.backBtn = compareAreaEl.querySelector('.compare-button_back')
    this.nextBtn = compareAreaEl.querySelector('.compare-button_next')

    this.backBtn.addEventListener('click', () => {
      this.compareOffset -= 1;
    })
    this.nextBtn.addEventListener('click', () => {
      this.compareOffset += 1;
    })

    this.productsEls = Array.from(this.productRowEl.querySelectorAll('.compare-area__item'))

    this._hammer = new Hammer.Manager(compareAreaEl)

    this._hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }) );

    this._hammer.on('pan', this.panHandler.bind(this))

    this.render();
    console.log(this);
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

  get currentOffsetWidth() {
    if (!this._currentOffsetWidth) this._currentOffsetWidth = 0
    return this._currentOffsetWidth
  }

  set currentOffsetWidth(val) {
    let newOffset = val
    const maxOffset = (this.productsIds.length - this.availableCount ) * this.productWidth

    console.log(val, maxOffset)
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

  get hiddenContainer() {
    if (this._hiddenContainer) return this._hiddenContainer;

    this._hiddenContainer = document.createElement('div');

    return this._hiddenContainer
  }

  get filling() {
    this._hiddenLeft = this.productsIds.splice(0, this.compareOffset)
    this._hiddenRight = this.productsIds.splice(this.compareOffset + this.availableCount)
    this._visible =  this.productsIds.splice(this.compareOffset, this.availableCount)

    return [
      this._hiddenLeft,
      this._visible,
      this._hiddenRight
    ]
  }

  panHandler(e) {
    this.currentOffsetWidth += -e.velocityX * 15;
    if(e.eventType === 4) {
      this.compareOffset = Math.round(
        this.currentOffsetWidth / this.productWidth
      )
    }
  }

  offsetHandler(offsetWidth) {
    const [hiddenLeft, visible, hiddenRight] = this.filling;

    for (const productID of [...hiddenLeft, ...visible, ...hiddenRight]) {
      this.productRowEl.querySelector(`[data-product-id="${productID}"]`).style.transform = `translateX(${-offsetWidth}px)`;

      Array.from(this.specificationRowEl.querySelectorAll(`[data-product-id="${productID}"] .compare-area__item__content`))
        .forEach((el) => {
          if(!el) return;
          el.style.transform = `translateX(${-offsetWidth}px)`
        })
    }
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

    this.currentOffsetWidth = this.compareOffset * this.productWidth
  }
}
