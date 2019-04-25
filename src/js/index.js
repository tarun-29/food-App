import Search from './models/Search'
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import List from './models/List'
import * as listView from './views/listView'
import Likes from './models/Likes';
import * as likesView from './views/likesView'


/** Global state of App
 * - Search Object
 * - Current recipe Object
 * - Shopping list object
 * - Liked recipe
 */
const state = {};

/**
 * Search Controller
 */
const controlSearch = async()=>{
    //1. get query from view
    const query = searchView.getInput();//TODO
    console.log(query);

    if(query){
        //2. new search object and add to state
        state.search = new Search(query);

        //3. prepare ui from results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //4. search for recipes
        try {
            await state.search.getResults();

            //5. render result in ui
            // console.log(state.search.result)
            console.log(state.search.result)
    
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(err){
            console.log(err);
            clearLoader();
        }
        console.log(state.search.result,)
    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline')
    // console.log(e.target)
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults(); 
        searchView.renderResults(state.search.result, goToPage);
        console.log
    }
})

/**
 * Recipe Controller
 */

const controlRecipe = async()=>{
    //Get id from the url 
    const id = window.location.hash.replace('#','');

    if(id) {
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        //highlight the selected itmes
        if(state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        //Get recipe Data and parse Ingredient 
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calc Time and Calc Serving
            state.recipe.calctime();
            state.recipe.calcServings();
    
            //render Recipe
            // console.log(state.recipe) 
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id),
                );
        }
        catch(error){
            console.log(error);
            clearLoader();
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
//equivalent to the above two lines
['hashchange', 'load'].forEach(event=>window.addEventListener(event, controlRecipe))

//handling recipe button clicks
/**
 * List Controller
 */

const controlList = ()=>{
    //create a new list if there is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient in list
    state.recipe.ingredients.forEach(el =>{
       const item = state.list.addItem(el.count, el.unit, el.ingredient);
       console.log(item)
       listView.renderItem(item);
    });
}

//handle delete and update list item events

elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping_item').dataset.item

    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);

        listView.deleteItem(id);
        //handle count update
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val)
    }
})

/**
 * Likes Controller
 */

const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
        const currentID = state.recipe.id
        //user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //Add Like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button
            likesView.toggleLikeBtn(true);
        //Add Like to UI List
        likesView.renderLike(newLike);
        console.log(state.likes)
        //user has not yet liked current recipe
    }else{
        //Remove Like from to state
        state.likes.deleteLike(currentID);
        //Toggle the like button
            likesView.toggleLikeBtn(false);
        //Remove Like to UI List
        likesView.deleteLike(currentID)
        console.log(state.likes)
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// restore Like recipe on page Load
window.addEventListener('load', ()=>{
    state.likes = new Likes();
    //Restore Likes
    state.likes.readStorage();
    //Toggle Like Menu Button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render existing likes
    state.likes.likes.forEach(like=>likesView.renderLike(like))
})

elements.recipe.addEventListener('click', e=>{
    if(event.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if(event.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add Ingredient to Shopping List
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        //LikeController
        controlLike();
    }
    console.log(state.recipe);
})

// window.l = new List();


// const r = new Recipe(46956);
// r.getRecipe();



// const search = new Search('pizza');
// // console.log(search);
// search.getResults();
