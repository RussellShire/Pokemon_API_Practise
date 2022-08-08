const pokedex = document.getElementById('pokedex');
// QUESTION FOR GRAHAM: I've got two options here, global or local variable, which is preferred?
//const pokeNames = [];
//const pokedexArray = [];

// Getting names of pokemon fromt the API so we can build URLs for future API calls
async function fetchPokeNames(pokeCounter = 151) {
    const pokeCount = pokeCounter;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${pokeCount}`);
    const data = await response.json()

// Two options here:
    // Mapping pokemon names to a global array currently commented out
    //data.results.map(pokemon => pokeNames.push(pokemon.name))
    
    // Returning an array that can be used within functions
    return data.results.map(pokemon => pokemon.name) 
}

// Fetch API Version 7, asyncing all of .then so it's ES8
async function fetchPokemon(pokeCounter){
    // Requesting all the names of the Pokemon from the API to build the urls for more specific calls
    const pokeNum = pokeCounter;    
    const pokeNames = await fetchPokeNames(pokeNum)
    
// QUESTION FOR GRAHAM: Did I use promise all correctly here?
    const pokemon = await Promise.all(
        //mapping through the variable that has been populated by fetchPokeNames() 
        pokeNames.map(async pokemon => {
            // url is edited by map
            const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}` 
            
            // fetching everything from API and converting to json
            const response = await fetch(url);
            const data = await response.json();
            
            //returning an object inline that contains just the required data from the API
            return {
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                backImage: data.sprites['back_default'],
                type: data.types.map( type => type.type.name) // mapping through an array in the data and getting out multiple entries
                .join(', ') // joining the array into a string, this is optional
                    
        };
    }));

    // passing the created Pokemon objects into function
    displayPokemon(pokemon);
    //Option to send created pokemon to a global Array
    //storePokemon(pokemon)      
};

//Function to add pokemon to an array to be used later, currently not being used
// const storePokemon = (pokemon) => pokemon.map(individualPokemon => pokedexArray.push(individualPokemon)); 

//Dynamically building HTML to display pokemon, would eventually be better as createElement rather than innerHTML
const displayPokemon = (pokemon) => {
    // Building HTML for each pokemon using .map
    const pokemonHtmlString = pokemon.map((individualPokemon) => `
    <li class="card-border">
        <div class="card" id="card">
            <img class="card-image" src="${individualPokemon.image}"/>
            <div class="card-title"><h2 class="poke-id" id="poke-id">${individualPokemon.id}.</h2> <h2 id="poke-name">${individualPokemon.name}</h2></div>
            <p class="card-subtitle">Type: ${individualPokemon.type}</p>
        </div>
    </li>
    `).join('') // converts .map array to a string so it can be fed into innerHTML
    
    pokedex.innerHTML = pokemonHtmlString;
}

//Currently loading quite slow with 150 API calls, might be good to have them load on scroll
fetchPokemon(150)

// TESTING BELOW HERE

/* trying to apply event listeners to dynamically created elements
pokedex.onclick = (e) => {
    console.log(e.target.classList.contains('poke-id'))
    console.log(e.target.innerHTML)
    //if (image.classList.contains('card-image')) {
        
        //image.innerHTML = 'testtesttest'
        //console.log(e.target)
    
   // }
}*/

// Different implementations of API below, increasing in sophistication between versions, 
// kept as a reference for future projects

/* Fetch API Version 1, making an object value by value
const fetchPokemon = () => {
    const url = `https://pokeapi.co/api/v2/pokemon/74`
    fetch(url)
        .then( response => {
            return response.json()  //making the response into a json and returning it as a promise
        })
        .then( data => { // taking the data from the promise and logging
            console.log(data)
            const pokemon = {}; // setting an object
            pokemon['name'] = data.name; // assigning the object a name value from the data set
            pokemon['id'] = data.id;
            pokemon['image'] = data.sprites['front_default']; // getting an image from nested data
            pokemon['type'] = data.types.map(type => type.type.name) // mapping through an array and getting out multiple entries
            .join(', '); // joins the array into a string so it's easier for later, this is optional
            console.log(pokemon)
        });
};*/

/* Fetch API Version 2, making the same object inline
const fetchPokemon = () => {
    const i = 74;
    const url = `https://pokeapi.co/api/v2/pokemon/${i}` // url is also now edited by a variable

    fetch(url) // adding promises created by the for loop to the promises array
    .then(response => response.json())  //making the response into a json and returning it as a promise
    .then( data => { // taking the data from the promise and logging
        const pokemon = { // creating a pokemon object with values from the api
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map(type => type.type.name) // mapping through an array and getting out multiple entries
            .join(', ') // joins the array into a string so it's easier for later, this is optional
        };
    });
};
*/

/* Fetch API Version 3, Creating a loop that changes the URL and returns each pokemon one after the other
const fetchPokemon = () => {
    for(let i = 1; i<= 150; i++) { //for loop that counts from 1 to 150    
        const url = `https://pokeapi.co/api/v2/pokemon/${i}` // url is edited by for loop.

        fetch(url) // adding promises created by the for loop to the promises array
        .then(response => response.json())  //making the response into a json and returning it as a promise
        .then( data => { // taking the data from the promise and logging
            const pokemon = { // creating a pokemon object with values from the api
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                type: data.types.map(type => type.type.name) // mapping through an array and getting out multiple entries
                .join(', ') // joins the array into a string so it's easier for later, this is optional
                };
            });
        }
};*/

/* Fetch API Version 4, using Promise.all to return all Pokemon at the same time rather than one after the other
const fetchPokemon = () => {
    const promises = []; // initializing an array for promises
    
    for(let i = 1; i<= 151; i++) { //for loop that counts from 1 to 150 and assigns to i   
        const url = `https://pokeapi.co/api/v2/pokemon/${i}` // url is edited by for loop.

        // adding promises created by the for loop to the promises array
        promises.push(fetch(url).then(response => response.json()))  // also making the response into a json
    }
    
    // Resolving all the promises from the array simultaniously
    Promise.all(promises).then((results) => { // Taking each result and mapping them onto Pokemon objects
        const pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            backImage: data.sprites['back_default'],
            type: data.types.map(type => type.type.name) // mapping through an array in the data and getting out multiple entries
            .join(', ') // joining the array into a string, this is optional
            
        }));
        displayPokemon(pokemon);
        storePokemon(pokemon)     
    });
};
*/

/* Fetch API Version 5, using names instead of numbers
async function fetchPokemon(){
    const promises = []; // initializing an array for promises
    const pokeCounter = 150;
    await fetchPokeNames(pokeCounter+1)
    
    //console.log(`https://pokeapi.co/api/v2/pokemon/${pokeNames[0]}`)
    //console.log(pokeNames[0]=1)
    for(let i = 0; i<= pokeCounter; i++) { //for loop that counts from 1 to 150 and assigns to i   
            const url = `https://pokeapi.co/api/v2/pokemon/${pokeNames[i]}` // url is edited by for loop.
            console.log(url)
            // adding promises created by the for loop to the promises array
            promises.push(fetch(url).then(response => response.json()))  // also making the response into a json
        }
        
        // Resolving all the promises from the array simultaniously
        Promise.all(promises).then((results) => { // Taking each result and mapping them onto Pokemon objects
            const pokemon = results.map((data) => ({
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                backImage: data.sprites['back_default'],
                type: data.types.map(type => type.type.name) // mapping through an array in the data and getting out multiple entries
                .join(', ') // joining the array into a string, this is optional
                
            }));
        displayPokemon(pokemon);
        storePokemon(pokemon)     
    });
};*/

/* Fetch API Version 6, using map instead of for loop
async function fetchPokemon(){
    const promises = []; // initializing an array for promises
    const pokeCounter = 10;
    await fetchPokeNames(pokeCounter+1)
    
    pokeNames.map(pokemon => {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}` // url is edited by for loop.
        console.log(url)
        // adding promises created by the map to the promises array
        promises.push(fetch(url).then(response => response.json()))  // also making the response into a json
    
    })
      
    // Resolving all the promises from the array simultaniously
    Promise.all(promises).then((results) => { // Taking each result and mapping them onto Pokemon objects
        const pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            backImage: data.sprites['back_default'],
            type: data.types.map(type => type.type.name) // mapping through an array in the data and getting out multiple entries
            .join(', ') // joining the array into a string, this is optional
                
            }));
        displayPokemon(pokemon);
        storePokemon(pokemon)     
    });
};*/