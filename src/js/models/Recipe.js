import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    //Gets the recipe 
    async getRecipe() {
        try {
            const recipeResult = await axios.get(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = recipeResult.data.recipe.title;
            this.ingredients = recipeResult.data.recipe.ingredients;
            this.image_url = recipeResult.data.recipe.image_url;
            this.publisher = recipeResult.data.recipe.publisher;
            this.source_url = recipeResult.data.recipe.source_url;
        } catch (error) {
            alert('Oops! Something went wrong :(' + error);
        }
    }

    //Calculate the recipe cooking time 
    calculateCookingTime() {
        const numOfIngredients = this.ingredients.length;
        const timePeriod = Math.ceil(numOfIngredients / 3);
        this.cookingTime = timePeriod * 15;
    }

    //Calculate the recipe servings 
    calculateServings() {
        this.servings = 4;
    }

    //Changing to Standard Recipe Units 
    standardIngredients() {

        const usedUnits = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'lbs', 'lb'];
        const standardUnits = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'lb', 'lb'];
        const units = [...standardUnits, 'kg', 'g'];
        const newIngredients = this.ingredients.map(element => {
            let ing = element.toLowerCase();
            usedUnits.forEach((unit, index) => {
                ing = ing.replace(unit, standardUnits[index]);
            });

            ing = ing.replace(/ *\([^)]*\) */g, ' '); //Removes the contents in () parenthesis

            const arrayIng = ing.split(' ');
            const unitIndex = arrayIng.findIndex(el => units.includes(el));
            let objectIng;
            if (unitIndex > -1) {
                const countIndex = arrayIng.slice(0, unitIndex); // Everything before Unit is considered as Count
                let count;
                if (countIndex.length === 1) {
                    count = eval(arrayIng[0].replace('-', '+'));
                    if (count === undefined) count = 1;
                } else {
                    if(countIndex[1] === 'to') 
                        count = (parseInt(countIndex[0]) + parseInt(countIndex[2]))/2;
                    else 
                        count = eval(arrayIng.slice(0, unitIndex).join('+'));
                }
                objectIng = {
                    count,
                    unit: arrayIng[unitIndex],
                    name: arrayIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrayIng[0], 10)) { //There is no unit but number is given
                objectIng = {
                    count: parseInt(arrayIng[0], 10),
                    unit: '',
                    name: arrayIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) { //There is no unit and number given

                if (arrayIng[0] === 'a') { //If it starts with A , remove it. Eg : A bowl of butter ~ 1 bowl of butter
                    objectIng = {
                        count: 1,
                        unit: '',
                        name: arrayIng.slice(1).join(' ')
                    }
                } else {
                    objectIng = {
                        count: 1,
                        unit: '',
                        name: ing
                    }
                }
            }

            if(objectIng.count < 0) objectIng.count *=-1;
            return objectIng;
        });

        this.ingredients = newIngredients;
    }


    //Update the ingredients count depending on the servings
    updateIngredients(type) {
        const newServings = (type === 'dec' ? this.servings - 1 : this.servings + 1);
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        this.servings = newServings;
    }


}