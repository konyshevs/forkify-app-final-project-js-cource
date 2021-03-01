import icons from '../../img/icons.svg';
import View from './view.js';
import PreviewView from './previewView.js';

class ResultsView extends View {
  constructor() {
    super();
    this._parentEl = document.querySelector('.results');
    this._errorMessage = 'No recipes found for your query. Please try again!';
    this._message;
  }

  _generateMarkup() {
    return this._data.map(result => PreviewView.render(result, false)).join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);
    console.log(result);
    return `
      <li class="preview">
          <a class="preview__link ${
            id === result.id ? 'preview__link--active' : ''
          }" href="#${result.id}">
            <figure class="preview__fig">
              <img src="${result.image}" alt="${result.title}" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${result.title}</h4>
              <p class="preview__publisher">${result.publisher}</p>
              <div class="preview__user-generated ${
                result.key ? '' : 'hidden'
              }">
               <svg>
                 <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
      </li>`;
  }
}

export default new ResultsView();
