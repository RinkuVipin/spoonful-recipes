
import {limitSearchTitle} from './searchView.js';
import {
    domElements
} from './domElements';


//The Liked Button is filled heart and Unliked Button is Outlined heart icon
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

//Like Menu must be visible only if there is any liked recipes are present 
export const toggleLikeMenu = numOfLikes => {
    domElements.likesMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden';
}

//Liked recipes must be listed
export const displayLikedRecipes = like => {
    const likedRecipe = `
        <li>
            <a class="likes__link" href="#${like.recipeId}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.recipeTitle}">
                </figure> 
                <div class="likes__data">
                    <h4 class="likes__name">${limitSearchTitle(like.recipeTitle,24)}</h4>
                    <p class="likes__author">${like.publisher}</p>
                </div>
            </a>
        </li>    
    `;
    domElements.likesList.insertAdjacentHTML('beforeend', likedRecipe);
}


//Remove the Liked Recipe from the list
export const removeLikedRecipe = recipeId => {
    const likeItem = document.querySelector(`.likes__link[href*="${recipeId}"]`).parentElement;
    if(likeItem) likeItem.parentElement.removeChild(likeItem);
}