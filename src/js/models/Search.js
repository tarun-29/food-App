import axios from 'axios'
import {key, proxy} from '../config';
export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.results);
        }catch(error){
            alert(error);
        }   
    }

}


//API KEY: 7c2b0e99cef37140444f010022a5bdc9
//recipe search api
//https://www.food2fork.com/api/search
//recipe detail api
//https://www.food2fork.com/api/get
