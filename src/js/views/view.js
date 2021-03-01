import icons from '../../img/icons.svg';

export default class View {
  constructor() {
    this._parentEl = document.querySelector('.recipe');
    this._data;
    this._errorMessage =
      'We could not find that recipe. Please try another one!';
    this._message;
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
          <svg>
          <use href="${icons}#icon-loader"></use>
          </svg>
          </div>`;
    this._parentEl.innerHTML = markup;
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(markup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
        <div>
            <svg>
                <use href="${icons}#icon-smile"></use>              
            </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._parentEl.innerHTML = markup;
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>              
            </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._parentEl.innerHTML = markup;
  }
}
