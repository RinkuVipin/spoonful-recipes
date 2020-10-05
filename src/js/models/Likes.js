export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(recipeId, recipeTitle, publisher, img) {
        const like = {
            recipeId,
            recipeTitle,
            publisher,
            img
        }
        this.likes.push(like);
        this.storeLikes();
        return like;
    }

    deleteLikes(id) {
        const index = this.likes.findIndex(element => element.recipeId === id);
        this.likes.splice(index, 1);
        this.storeLikes();
    }

    isLiked(id) {
        return (this.likes.findIndex(element => element.recipeId === id) !== -1);
    }

    numOfLikes() {
        return this.likes.length;
    }

    //Stores Likes array in local storage
    storeLikes() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readLocalStorage() {
        const likesList = JSON.parse(localStorage.getItem('likes'));
        if (likesList) {
            this.likes = likesList;
        }
    }
}