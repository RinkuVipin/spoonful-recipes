import {
    domElements
} from './domElements';

export const displayItems = item => {
    const itemDisplay = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" class= "shopping__count-value" value="${item.count}" step="${item.count}" min="0">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
            </button>
        </li>
`;
    domElements.shoppingList.insertAdjacentHTML('beforeend', itemDisplay);
};


export const removeItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};