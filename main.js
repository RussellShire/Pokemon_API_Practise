const pokedex = document.getElementById('pokedex');
const pokeNames = [];
const pokedexArray = [];

async function fetchPokeNames(pokeCounter = 151) {
    const pokeCount = pokeCounter;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${pokeCount}`);
    const data = await response.json()

    // Mapping pokemon names to a global array
    data.results.map(async pokemon => pokeNames.push(await pokemon.name))   
}

// Fetch API Version 5, converting to Async Await and building with names instead of numbers in URL as will be the case with most APIs
async function fetchPokemon(){
    await fetchPokeNames(11)
    
    const pokemonBuilder = await Promise.all(pokeNames.map(async pokeName => {
            const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`
            const result = await fetch(url);
            const data = await result.json();
            //console.log(data.name);
            return data
        }))

    const pokemon = await pokemonBuilder.map((data) => ({
        name: data.name,
        id: data.id,
        image: data.sprites['front_default'],
        backImage: data.sprites['back_default'],
         type: data.types.map(type => type.type.name) // mapping through an array in the data and getting out multiple entries
            .join(', ') // joining the array into a string, this is optional
    }))
    //console.log(pokemon)
    return pokemon
};

fetchPokemon()
    
const storePokemon = (pokemon) => pokemon.map(individualPokemon => pokedexArray.push(individualPokemon)); 

const displayPokemon = (pokemon) => {
    //console.log(pokemon)
    
    // Building HTML for each pokemon using .map
    const pokemonHtmlString = pokemon.map(individualPokemon => `
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
*/

/* trying to apply event listeners to dynamically created elements
pokedex.onclick = (e) => {
    console.log(e.target.classList.contains('poke-id'))
    console.log(e.target.innerHTML)
    //if (image.classList.contains('card-image')) {
        
        //image.innerHTML = 'testtesttest'
        //console.log(e.target)
    
   // }
}*/

// Different implementations of API below, increasing in sophistication between versions

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