import icons from '../../img/icons.svg';
import View from './view.js';
import PreviewView from './previewView.js';

class BookmarksView extends View {
  constructor() {
    super();
    this._parentEl = document.querySelector('.bookmarks__list');
    this._errorMessage =
      'No bookmarks yet. Find a nice recipe and bookmark it :)';
    this._message;
  }

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
