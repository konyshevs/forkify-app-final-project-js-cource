class SerchView {
  constructor() {
    this._parentEl = document.querySelector('.search');
  }

  getQuery() {
    const value = this._parentEl.querySelector('.search__field').value;
    this._parentEl.querySelector('.search__field').value = '';
    return value;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SerchView();
