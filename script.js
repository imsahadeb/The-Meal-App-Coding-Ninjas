
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
         * Check and initialize the local storage items for favorite list 
         */
        
        
         const dbObjectFavList = "favMovieList";
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
         * Function to toggle the sidebar and display the list of favorite movies.
         * When the toggle button is clicked, the sidebar is shown or hidden and the list of favorite movies is displayed.
         * The flexBox class is also toggled to adjust the layout of the page.
         * 
        */
        toggleButton.addEventListener("click", function () {
            showFavMovieList();
            sidebar.classList.toggle("show");
            flexBox.classList.toggle('shrink');
        });
        
        
        /**
         * 
         * This function adds an event listener to the toggle button that when clicked, it calls the showFavMovieList function and adds or removes the "show" class to the sidebar element and "shrink" class to the flexBox element, respectively.
         * @event toggleButton - The button element that when clicked, triggers the event listener.
         * @function showFavMovieList - The function that is called when the toggle button is clicked. It populates the fav element with the list of favorite movies.
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
         * Fetch movies from API
         * 
         * @param {string} url - The base URL for the API
         * @param {string} value - The value to append to the URL for filtering the results
         * 
         * @returns {Promise} A promise that resolves to the JSON data of the movies
         */
        
        const fetchMoviesFromApi = async (url, value) => {
            const response = await fetch(`${url + value}`);
            const movies = await response.json();
            return movies;
        }
        
        
        /**
         * showMovieList - function to show movie list based on search input
         * 
         * @returns {void} 
         * 
         * This function first retrieves the data from local storage and then it fetches the movies data from API 
         * using the fetchMoviesFromApi function. It then maps over the movies data and creates the HTML template 
         * for each movie. This HTML template is then added to the DOM.
         */
        
        async function showMovieList() {
            const list = JSON.parse(localStorage.getItem(dbObjectFavList));
            const inputValue = document.getElementById("search-input").value;
            const url = "https://www.omdbapi.com/?apikey=7b6b319d&s=";
            const moviesData = await fetchMoviesFromApi(url, inputValue);
            let html = '';
            if (moviesData.Search) {
                html = moviesData.Search.map(element => {
        
                    return `
        
                 
                    <div class="card">
                    <div class="card-top"  onclick="showMovieDetails('${element.imdbID}', '${inputValue}')">
                        <div class="movie-poster" >
                        <img src="${element.Poster=='N/A' ? './assets/backdrop.jpg' : element.Poster}" alt="">
                        </div>
                        <div class="movie-name">
                           ${element.Title}
                        </div>
                        <div class="movie-year">
                          (  ${element.Year})
            
                            <span class="button" onclick="showMovieDetails('${element.imdbID}', '${inputValue}')">Know More</span>
                         
                        </div>
                    </div>
                    <div class="card-bottom">
                        <div class="like">
        <Strong> Add to Favoruite: </Strong>
                        <i class="fa-solid fa-star ${isFav(list, element.imdbID) ? 'active' : ''} " onclick="addRemoveToFavList('${element.imdbID}')"></i>
                        
                        </div>
                        
                    </div>
                </div>
                    `
                }).join('');
                document.getElementById('cards-holder').innerHTML = html;
            }
        }
        
        
        
        /**
         * addRemoveToFavList - function to add or remove a movie from the favorite list
         * 
         * @param {string} id - The id of the movie to be added or removed
         *
         * This function first retrieves the data from local storage and then it checks if the provided movie id already exist in the favorite list.
         * If it exists, it removes it from the list, otherwise it adds it to the list. It then updates the local storage and updates the UI.
         */
        
        function addRemoveToFavList(id) {
            const detailsPageLikeBtn = document.getElementById('like-button');
            let db = JSON.parse(localStorage.getItem(dbObjectFavList));
            console.log('before: ', db);
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
        
            console.log('After:',db);
            showMovieList();
            showFavMovieList();
            updateTask();
        }
        
        
        /**
         * Show details for a specific movie
         * @async
         * @function
         * @param {string} itemId - The ID of the movie to show details for
         * @param {string} searchInput - The search input used to fetch the related movies
         */
         
        async function showMovieDetails(itemId, searchInput) {
            console.log("searchInput:...............", searchInput);
            const list = JSON.parse(localStorage.getItem(dbObjectFavList));
            flexBox.scrollTo({ top: 0, behavior: "smooth" });
            const url = "https://www.omdbapi.com/?apikey=7b6b319d&i=";
            const searchUrl = "https://www.omdbapi.com/?apikey=7b6b319d&s=";
            const movieList = await fetchMoviesFromApi(searchUrl,searchInput);
            console.log('movieslist:..........',movieList);
            let html = ''
            const movieDetails = await fetchMoviesFromApi(url, itemId);
            if (movieDetails) {
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
                            <form onkeyup="showMovieList()">
                                <input id="search-input" type="text" placeholder="Search food, receipe" />
                            </form>
                        </div>
                    </div>
                </div>
                <div class="item-details">
                <div class="item-details-left">
                <img src="${movieDetails.Poster =='N/A' ? './assets/backdrop.jpg' : movieDetails.Poster}" alt="">
            </div>
            <div class="item-details-right">
                <div class="item-name">
                    <strong>Movie Name: </strong>
                    <span class="item-text">
                    ${movieDetails.Title}
                    </span>
                 </div>
                <div class="movie-category">
                    <strong>Genre: </strong>
                    <span class="item-text">
                    ${movieDetails.Genre}
                    </span>
                </div>
                <div class="movie-info">
                    <strong>Actors: </strong>
                    <span class="item-text">
                    ${movieDetails.Actors}
                    </span>
                </div>

                <div class="movie-info">
                <strong>Directors: </strong>
                <span class="item-text">
                ${movieDetails.Director}
                </span>
            </div>
                <div class="movie-plot">
                    <strong>Plot: </strong>
                    <span class="item-text">
                    ${movieDetails.Plot}
                    </span>
                </div>
                <div class="movie-rating">
                    <strong>Ratings: </strong>
                    <span class="item-text"> 
                    ${movieDetails.Ratings[0].Value}
                  
                    </span>
                    <div id="like-button" onclick="addRemoveToFavList('${movieDetails.imdbID}')"> 
                     ${isFav(list, movieDetails.imdbID) ? 'Remove From Favourite' : 'Add To Favourite'} </div>
                </div>
            </div>
        </div> 
                <div class="card-name">
                Related Items
            </div>
            <div id="cards-holder" class=" remove-top-margin ">`
            }
            if( movieList.Search){
                html += movieList.Search.map(element => {
                    return `       
                    <div class="card">
                        <div class="card-top"  onclick="showMovieDetails('${element.imdbID}', '${searchInput}')">
                            <div class="movie-poster" >
                            <img src="${element.Poster=='N/A' ? './assets/backdrop.jpg' : element.Poster}" alt="">
                            </div>
                            <div class="movie-name">
                                ${element.Title}
                            </div>
                            <div class="movie-year">
                                ${element.Year}
                                <span class="button" onclick="showMovieDetails('${element.imdbID}', '${searchInput}')">Know More</span>
                            </div>
                        </div>
                        <div class="card-bottom">
                        <div class="like">
        <Strong> Add to Favoruite: </Strong>
                        <i class="fa-solid fa-star ${isFav(list, element.imdbID) ? 'active' : ''} " onclick="addRemoveToFavList('${element.imdbID}')"></i>
                        
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
        
        This function is used to show all the movies which are added to the favourite list.
        
        @function
        
        @async
        
        @returns {string} html - This returns html which is used to show the favourite movies.
        
        @throws {Error} If there is no favourite movie then it will show "Nothing To Show....."
        
        @example
        
        showFavMovieList()
        */
        async function showFavMovieList() {
            let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
            let url = "https://www.omdbapi.com/?apikey=7b6b319d&i=";
            let html = "";
        
            if (favList.length == 0) {
                html = `<div class="fav-item nothing"> <h1> 
                Nothing To Show.....</h1> </div>`
            } else {
                for (let i = 0; i < favList.length; i++) {
                    const favmovieList = await fetchMoviesFromApi(url, favList[i]);
                    if (favmovieList) {
                        let element = favmovieList;
                        html += `
                        <div class="fav-item">
        
                      
                        <div class="fav-item-photo"  onclick="showMovieDetails('${element.imdbID}','arjun')">
                        <img src="${element.Poster=='N/A' ? './assets/backdrop.jpg' : element.Poster}" alt="">
                        </div>
                        <div class="fav-item-details">
                            <div class="fav-item-name">
                                <strong>Name: </strong>
                                <span class="fav-item-text">
                                ${truncate(element.Title,20)}
                                </span>
                            </div>
                            <div id="fav-like-button" onclick="addRemoveToFavList('${element.imdbID}')">
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
        
        