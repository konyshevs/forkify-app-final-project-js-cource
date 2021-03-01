import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as Model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(Model.getSearchResultsPage());
    // bookmarksView.update(Model.state.bookmarked);

    // 1. Loading recipe
    await Model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(Model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search results
    await Model.searchRecipe(query);

    //3. Render results
    resultsView.render(Model.getSearchResultsPage());
    paginationView.render(Model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  resultsView.render(Model.getSearchResultsPage(page));
  paginationView.render(Model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  Model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(Model.state.recipe);
};

const controlAddBokkmarks = function () {
  // 1. Add/remove bookmark
  if (!Model.state.recipe.bookmarked) Model.addBookmark(Model.state.recipe);
  else Model.removeBokkmark(Model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(Model.state.recipe);

  // 3. Render bookmark
  bookmarksView.render(Model.state.bookmarked);
};

const controlBokkmarks = function () {
  bookmarksView.render(Model.state.bookmarked);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await Model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(Model.state.recipe);

    // Rerender bookmarks
    bookmarksView.render(Model.state.bookmarked);
    // Success message
    addRecipeView.renderMessage();

    // Change ID in URL
    window.history.pushState(null, '', `${Model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.openCloseModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
  // Upload new recipe
};

function init() {
  bookmarksView.addHandlerRender(controlBokkmarks);
  recipeView.addHandlerRander(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddToBookmarks(controlAddBokkmarks);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
}
init();
