import {
    Fraction
} from 'fractional';

import {
    domElements
} from './domElements';


//Clears the Recipe panel
export const clearRecipeResult = () => {
    domElements.recipe.innerHTML = "";
}


//Displays the count for each ingredient in fractions
const formatIngCount = count => {
    if (count) {
        const newCount = count; //Math.round(count*10000)/10000;
        const [int, dec] = newCount.toString().split('.').map(element => parseInt(element, 10));
        if (!dec)
            return newCount;
        if (int === 0) {
            const frct = new Fraction(newCount);
            return `${frct.numerator} / ${frct.denominator}`;
        } else {
            const frct = new Fraction(newCount- int);
            return `${int} ${frct.numerator}/${frct.denominator}`;
        }
    }
    return count;
}

//Displays each ingredient to the list
const createIngredient = ingredient =>
    `<li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatIngCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.name}
        </div>
    </li>  
`;

//Displays Image , Ingredients and "Add to Shopping List" feature and "Source URL" of the recipe
export const displayRecipeResult = (recipe, isLiked) => {

    const recipeDisplay = `
            <figure class="recipe__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>
                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button> 
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                    ${recipe.ingredients.map(ingredient => createIngredient(ingredient)).join(' ')}       
                </ul>

                <button class="btn-small recipe__btn shopping_list_btn">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>
            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.source_url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </a>
            </div>
    `;
    domElements.recipe.insertAdjacentHTML('afterbegin', recipeDisplay);

}


//Updates Ingredients Count and servings of the recipe
export const updateServingsIngredients = recipe => {
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    const ingredients = Array.from(document.querySelectorAll('.recipe__count'));
    ingredients.forEach((ingredient, index) => {
        ingredient.textContent = formatIngCount(recipe.ingredients[index].count);
    });
}