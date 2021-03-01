import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarked: [],
};

function createRecipeObject(data) {
  const { recipe } = data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(id) {
  try {
    const { data } = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarked.some(rec => rec.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
}

export async function searchRecipe(query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity / state.recipe.servings) * newServings)
  );
  state.recipe.servings = newServings;
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarked));
}

export function addBookmark(recipe) {
  state.bookmarked.push(recipe);
  state.recipe.bookmarked = true;
  persistBookmarks();
}

export function removeBokkmark(id) {
  state.bookmarked.splice(
    state.bookmarked.findIndex(el => el.id === id),
    1
  );
  state.recipe.bookmarked = false;
  persistBookmarks();
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(elm => elm[0].startsWith('ingredient') && elm[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error('Wrong ingridient format!');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : '', unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const { data } = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarked = JSON.parse(storage);
}
init();
