import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getSearchResults() {
        try {
            const searchResult = await axios.get(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = searchResult.data.recipes;
        } catch (error) {
            alert('Oops! Something went wrong while retrieving data.');
            console.log(error);
        }
    }
}