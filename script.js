document.addEventListener('load', ()=>{
    updateTask();
})
/**
 * Get the DOM elements for toggle button, sidebar, flex-box, searchbar, dbObjectFavList, and dbLastInput
 */

 const toggleButton = document.getElementById("toggle-sidebar");
 const sidebar = document.getElementById("sidebar");
 const flexBox = document.getElementById('flex-box');
 const searchbar = document.getElementById('search-bar');


 
/**
 * Check and initialize the local storage items for favorite list and last input
 */


 const dbObjectFavList = "favouritesList";
 if (localStorage.getItem(dbObjectFavList) == null) {
    localStorage.setItem(dbObjectFavList, JSON.stringify([]));
}
 


/**
 * Update the task counter with the current number of items in the favorite list.
*/
function updateTask() {
    const favCounter = document.getElementById('total-counter');
    const db = JSON.parse(localStorage.getItem(dbObjectFavList));
    if (favCounter.innerText != null) {
        favCounter.innerText = db.length;
    }

}


/**
 * Check if an ID is in a list of favorites
 *
 * @param list The list of favorites
 * @param id The ID to check
 * @return true if the ID is in the list, false otherwise
 */

 function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
        if (id == list[i]) {
            res = true;
        }
    }
    return res;
}



/**************************** Some Usefull Utility Function***************************** */

 /**
  * It return truncated string greater then 50
  * @param {*} str 
  * @param {*} n 
  * @returns 
  */
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

/**
 * Generates a random character string starting 
 * @returns {string} The generated string
 */
 function generateOneCharString() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
}



/**
 * Function to toggle the sidebar and display the list of favorite meals.
 * When the toggle button is clicked, the sidebar is shown or hidden and the list of favorite meals is displayed.
 * The flexBox class is also toggled to adjust the layout of the page.
 * 
*/
toggleButton.addEventListener("click", function () {
    showFavMealList();
    sidebar.classList.toggle("show");
    flexBox.classList.toggle('shrink');
});


/**
 * 
 * This function adds an event listener to the toggle button that when clicked, it calls the showFavMealList function and adds or removes the "show" class to the sidebar element and "shrink" class to the flexBox element, respectively.
 * @event toggleButton - The button element that when clicked, triggers the event listener.
 * @function showFavMealList - The function that is called when the toggle button is clicked. It populates the fav element with the list of favorite meals.
 * @element sidebar - The sidebar element that has the "show" class added or removed.
 * @element flexBox - The flexbox element that has the "shrink" class added or removed.
*/

flexBox.onscroll = function () {

    if (flexBox.scrollTop > searchbar.offsetTop) {
        searchbar.classList.add("fixed");

    } else {
        searchbar.classList.remove("fixed");
    }
};


/**
 * Fetch meals from API
 * 
 * @param {string} url - The base URL for the API
 * @param {string} value - The value to append to the URL for filtering the results
 * 
 * @returns {Promise} A promise that resolves to the JSON data of the meals
 */

const fetchMealsFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


/**
 * showMealList - function to show meal list based on search input
 * 
 * @returns {void} 
 * 
 * This function first retrieves the data from local storage and then it fetches the meals data from API 
 * using the fetchMealsFromApi function. It then maps over the meals data and creates the HTML template 
 * for each meal. This HTML template is then added to the DOM.
 */

async function showMealList() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const inputValue = document.getElementById("search-input").value;
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealsData = await fetchMealsFromApi(url, inputValue);
    let html = '';
    if (mealsData.meals) {
        html = mealsData.meals.map(element => {

            return `

         
            <div class="card">
            <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${inputValue}')">
                <div class="dish-photo" >
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="dish-name">
                    ${element.strMeal}
                </div>
                <div class="dish-details">
                    ${truncate(element.strInstructions, 50)}
                    
                    <span class="button" onclick="showMealDetails(${element.idMeal}, '${inputValue}')">Know More</span>
                 
                </div>
            </div>
            <div class="card-bottom">
                <div class="like">

                <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " onclick="addRemoveToFavList(${element.idMeal})"></i>
                
                </div>
                <div class="play">
                    <a href="${element.strYoutube}">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
        </div>
            `
        }).join('');
        document.getElementById('cards-holder').innerHTML = html;
    }
}



/**
 * addRemoveToFavList - function to add or remove a meal from the favorite list
 * 
 * @param {string} id - The id of the meal to be added or removed
 *
 * This function first retrieves the data from local storage and then it checks if the provided meal id already exist in the favorite list.
 * If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage and updates the UI.
 */

function addRemoveToFavList(id) {
    const detailsPageLikeBtn = document.getElementById('like-button');
    let db = JSON.parse(localStorage.getItem(dbObjectFavList));
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
        if (id == db[i]) {
            ifExist = true;

        }

    } if (ifExist) {
        db.splice(db.indexOf(id), 1);

    } else {
        db.push(id);

    }

    localStorage.setItem(dbObjectFavList, JSON.stringify(db));
    if (detailsPageLikeBtn != null) {
        detailsPageLikeBtn.innerHTML = isFav(db, id) ? 'Remove From Favourite' : 'Add To Favourite';
    }

    showMealList();
    showFavMealList();
    updateTask();
}


/**
 * Show details for a specific meal
 * @async
 * @function
 * @param {string} itemId - The ID of the meal to show details for
 * @param {string} searchInput - The search input used to fetch the related meals
 */
 
async function showMealDetails(itemId, searchInput) {
    console.log("searchInput:...............", searchInput);
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    flexBox.scrollTo({ top: 0, behavior: "smooth" });
    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    const searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealList = await fetchMealsFromApi(searchUrl,searchInput);
    console.log('mealslist:..........',mealList);
    let html = ''
    const mealDetails = await fetchMealsFromApi(url, itemId);
    if (mealDetails.meals) {
        html = `
        <div class="container remove-top-margin">

            <div class="header hide">
                <div class="title">
                    Let's Eat Something New
                </div>
            </div>
            <div class="fixed" id="search-bar">
                <div class="icon">
                    <i class="fa-solid fa-search "></i>
                </div>
                <div class="new-search-input">
                    <form onkeyup="showMealList()">
                        <input id="search-input" type="text" placeholder="Search food, receipe" />
                    </form>
                </div>
            </div>
        </div>
        <div class="item-details">
        <div class="item-details-left">
        <img src="  ${mealDetails.meals[0].strMealThumb}" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Name: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strMeal}
            </span>
         </div>
        <div class="item-category">
            <strong>Category: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strCategory}
            </span>
        </div>
        <div class="item-ingrident">
            <strong>Ingrident: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strIngredient1},${mealDetails.meals[0].strIngredient2},
            ${mealDetails.meals[0].strIngredient3},${mealDetails.meals[0].strIngredient4}
            </span>
        </div>
        <div class="item-instruction">
            <strong>Instructions: </strong>
            <span class="item-text">
            ${mealDetails.meals[0].strInstructions}
            </span>
        </div>
        <div class="item-video">
            <strong>Video Link:</strong>
            <span class="item-text">
            <a href="${mealDetails.meals[0].strYoutube}">Watch Here</a>
          
            </span>
            <div id="like-button" onclick="addRemoveToFavList(${mealDetails.meals[0].idMeal})"> 
             ${isFav(list, mealDetails.meals[0].idMeal) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
        </div>
    </div>
</div> 
        <div class="card-name">
        Related Items
    </div>
    <div id="cards-holder" class=" remove-top-margin ">`
    }
    if( mealList.meals!=null){
        html += mealList.meals.map(element => {
            return `       
            <div class="card">
                <div class="card-top"  onclick="showMealDetails(${element.idMeal}, '${searchInput}')">
                    <div class="dish-photo" >
                        <img src="${element.strMealThumb}" alt="">
                    </div>
                    <div class="dish-name">
                        ${element.strMeal}
                    </div>
                    <div class="dish-details">
                        ${truncate(element.strInstructions, 50)}
                        <span class="button" onclick="showMealDetails(${element.idMeal}, '${searchInput}')">Know More</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <div class="like">
                       
                        <i class="fa-solid fa-heart ${isFav(list, element.idMeal) ? 'active' : ''} " 
                        onclick="addRemoveToFavList(${element.idMeal})"></i>
                    </div>
                    <div class="play">
                        <a href="${element.strYoutube}">
                            <i class="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
        `
        }).join('');
    }

  
    html = html + '</div>';

    document.getElementById('flex-box').innerHTML = html;
}



/**

This function is used to show all the meals which are added to the favourite list.

@function

@async

@returns {string} html - This returns html which is used to show the favourite meals.

@throws {Error} If there is no favourite meal then it will show "Nothing To Show....."

@example

showFavMealList()
*/
async function showFavMealList() {
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";

    if (favList.length == 0) {
        html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show.....</h1> </div>`
    } else {
        for (let i = 0; i < favList.length; i++) {
            const favMealList = await fetchMealsFromApi(url, favList[i]);
            if (favMealList.meals[0]) {
                let element = favMealList.meals[0];
                html += `
                <div class="fav-item" onclick="showMealDetails(${element.idMeal},'${generateOneCharString()}')">

              
                <div class="fav-item-photo">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                           ${element.strMeal}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList(${element.idMeal})">
                        Remove
                    </div>

                </div>

            </div>               
                `
            }
        }
    }
    document.getElementById('fav').innerHTML = html;
}



updateTask();
/************************************** End Of the Code ****************************************** */

