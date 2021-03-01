import icons from '../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  constructor() {
    super();
    this._parentEl = document.querySelector('.pagination');
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // First page
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupButton(null, curPage + 1);
    // Last page
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupButton(curPage - 1, null);
    // Other page
    if (curPage > 1)
      return this._generateMarkupButton(curPage - 1, curPage + 1);
    // Page 1 and there NO other pages
    return '';
  }

  _generateMarkupButton(prev, next) {
    const prevBtnMarkup = `
      <button data-toPage = "${prev}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${prev}</span>
      </button>`;

    const nextBtnMarkup = `
      <button data-toPage = "${next}" class="btn--inline pagination__btn--next">
          <span>Page ${next}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>`;

    if (!next) return prevBtnMarkup;
    if (!prev) return nextBtnMarkup;

    return prevBtnMarkup + nextBtnMarkup;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.topage);
    });
  }
}

export default new PaginationView();
