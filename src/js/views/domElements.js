export const domElements = {

    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResults: document.querySelector('.results'),
    searchPagination: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
};


//Adds Spinner while Loading
export const renderLoader = parent => {
    const loader = `
        <div class="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

//Removes Spinner after Loading
export const removeLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) loader.parentElement.removeChild(loader);
}