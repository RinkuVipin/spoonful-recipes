import {
    domElements
} from './domElements';

//Retrieve the search keyword from the site
export const getSearchInput = () => domElements.searchInput.value;

//Clear the search keyword from the site
export const clearSearchInput = () => {
    domElements.searchInput.value = '';
};

//Clear the search results from the site
export const clearSearchResults = () => {
    domElements.searchResultList.innerHTML = '';
    domElements.searchPagination.innerHTML = '';
};


//Display the Recipe Title in one line
export const limitSearchTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title = title.replace('-', ' ');
        title.split(' ').reduce((accumulator, current) => {

            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    };
    return title;
}


//Create Pagination Buttons at the Bottom
const createPagination = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

//Display Pagination Buttons at the Bottom
const displayPagination = (currentPage, recipePerPage, numOfResult) => {
    const totalPages = Math.ceil(numOfResult / recipePerPage); //Rounds to Higher Integer (Eg : 4.2 is rounded to 5)
    let pageButton;
    if (totalPages > 1) {
        if (currentPage === 1) {
            pageButton = createPagination(currentPage, 'next');
        } else if (currentPage === totalPages) {
            pageButton = createPagination(currentPage, 'prev');
        } else {
            pageButton = `${createPagination(currentPage, 'prev')} ${createPagination(currentPage, 'next')}`;
        }
    }
    domElements.searchPagination.insertAdjacentHTML('afterbegin', pageButton);
};


//Displays the search results in the site
const displaySearch = recipe => {
    const recipeDisplay = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitSearchTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    domElements.searchResultList.insertAdjacentHTML('beforeend', recipeDisplay);
};


//Displays the search results in the site
export const displaySearchResults = (recipes, page = 1, reciperPerPage = 10) => {
    const start = (page - 1) * reciperPerPage;
    const end = page * reciperPerPage;

    recipes.slice(start, end).forEach(displaySearch); // This is same as recipes.forEach( e => displaySearch(e)); 

    displayPagination(page, reciperPerPage, recipes.length);
};


//HighLight the selected recipe
export const highlightRecipe = (recipeId) => {
    const recipeList = Array.from(document.querySelectorAll('.results__link'));
    recipeList.map(element => element.classList.remove('results__link--active'));
    const recipeItem = document.querySelector(`.results__link[href*="${recipeId}"]`);
    if(recipeItem) recipeItem.classList.add('results__link--active');
}


