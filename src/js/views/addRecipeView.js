import View from './view.js';

class BookmarksView extends View {
  constructor() {
    super();
    this._parentEl = document.querySelector('.upload');
    this._window = document.querySelector('.add-recipe-window');
    this._overlay = document.querySelector('.overlay');
    this._btnOpen = document.querySelector('.nav__btn--add-recipe');
    this._btnClose = document.querySelector('.btn--close-modal');
    this._btnUpload = document.querySelector('.upload__btn');
    this._message = 'Recipe was successfully uploaded!';

    this._addHandlerOpenModal();
    this._addHandlerCloseModal();
  }
  openCloseModal() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpenModal() {
    this._btnOpen.addEventListener('click', this.openCloseModal.bind(this));
  }

  _addHandlerCloseModal() {
    this._btnClose.addEventListener('click', this.openCloseModal.bind(this));
    this._overlay.addEventListener('click', this.openCloseModal.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new BookmarksView();
