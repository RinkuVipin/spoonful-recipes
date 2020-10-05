// Global app controller
import 'core-js/stable';
import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';
import * as shoppingListView from './views/shoppingListView.js';
import * as likesView from './views/likesView.js';
import {
    domElements,
    renderLoader,
    removeLoader
} from './views/domElements.js';

const state = {};

/**
 * Search Recipes 
 **/

const controlSearchResults = async () => {
    const query = searchView.getSearchInput();

    if (query) {
        state.search = new Search(query);
        searchView.clearSearchInput();
        searchView.clearSearchResults();
        renderLoader(domElements.searchResults);
        try {
            await state.search.getSearchResults();
            removeLoader();
            searchView.displaySearchResults(state.search.result);

        } catch (error) {
            alert('Oops! Something went wrong with the search....');
            removeLoader();
        }
    }
}

domElements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearchResults();
});

//Pagination Buttons in the Recipe List
domElements.searchPagination.addEventListener('click', event => {
    const pageButton = event.target.closest('.btn-inline');
    if (pageButton) {
        searchView.clearSearchResults();
        const goto = parseInt(pageButton.dataset.goto, 10);
        searchView.displaySearchResults(state.search.result, goto);
    }
});



/**
 * Display Recipe
 **/

const controlRecipeResult = async () => {
    const recipeID = window.location.hash.replace('#', '');

    if (recipeID) {
        recipeView.clearRecipeResult();
        renderLoader(domElements.recipe);
        state.recipe = new Recipe(recipeID);

        try {
            await state.recipe.getRecipe();
            if (state.search) searchView.highlightRecipe(recipeID);
            state.recipe.standardIngredients();
            state.recipe.calculateCookingTime();
            state.recipe.calculateServings();
            recipeView.displayRecipeResult(state.recipe, state.likes.isLiked(recipeID));
            removeLoader();

        } catch (error) {
            alert('Oops! Something went wrong !' + error);
            console.log(error);
        }
    }
}

//window.addEventListener('hashchange', controlRecipeResult); and window.addEventListener('load', controlRecipeResult);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipeResult));


//Updating the recipe depending on the new servings
domElements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1)
            state.recipe.updateIngredients('dec');

    } else if (event.target.matches('.btn-increase, .btn-increase *'))
        state.recipe.updateIngredients('inc');
    recipeView.updateServingsIngredients(state.recipe);

})



/**
 * Shopping List
 **/

if (!state.shoppingList)
    state.shoppingList = new ShoppingList();

//Adding ingredients to Shopping List
domElements.recipe.addEventListener('click', event => {
    if (event.target.matches('.shopping_list_btn, .shopping_list_btn *')) {
        state.recipe.ingredients.forEach(ingredient => {
            const item = state.shoppingList.addItem(ingredient.count, ingredient.unit, ingredient.name);
            shoppingListView.displayItems(item);
        });
    }
});


//Removing ingredients from Shopping List and Updating the Count in the Shopping list
domElements.shoppingList.addEventListener('click', event => {
    const itemId = event.target.closest('.shopping__item').dataset.itemid;
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        state.shoppingList.deleteItem(itemId);
        shoppingListView.removeItem(itemId);

    } else if (event.target.matches('.shopping__count-value')) {
        const newCount = parseFloat(event.target.value, 10);
        state.shoppingList.updateItem(itemId, newCount);
    }
});



/**
 * Like List
 **/

domElements.recipe.addEventListener('click', event => {
    if (event.target.matches('.recipe__love, .recipe__love *')) {
        if (!state.likes)
            state.likes = new Likes();

        const recipeId = state.recipe.id;
        if (state.likes.isLiked(recipeId)) {
            state.likes.deleteLikes(recipeId);
            likesView.toggleLikeBtn(false);
            likesView.removeLikedRecipe(recipeId);

        } else {
            const like = state.likes.addLike(recipeId, state.recipe.title, state.recipe.publisher, state.recipe.image_url);
            likesView.toggleLikeBtn(true);
            likesView.displayLikedRecipes(like);
        }

        likesView.toggleLikeMenu(state.likes.numOfLikes());
    }
})


//Restores the Liked recipes after Page Reload
window.addEventListener('load', event => {
    state.likes = new Likes();
    state.likes.readLocalStorage();
    likesView.toggleLikeMenu(state.likes.numOfLikes());
    if (state.likes.numOfLikes() > 0) {
        state.likes.likes.forEach(like => likesView.displayLikedRecipes(like));
    }
});