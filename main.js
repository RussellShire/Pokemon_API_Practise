const pokedex = document.getElementById('pokedex');

// Getting names of pokemon fromt the API so we can build URLs for future API calls
async function fetchPokeNames(pokeCounter = 151) {
    const pokeCount = pokeCounter;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${pokeCount}`);
    const data = await response.json()
    
    // Returning an array that can be used within functions
    return data.results.map(pokemon => pokemon.name) 
}

// Fetch API Version 7, asyncing all of .then so it's ES8
async function fetchPokemon(pokeCounter){
    // Requesting all the names of the Pokemon from the API to build the urls for more specific calls
    const pokeNum = pokeCounter;    
    const pokeNames = await fetchPokeNames(pokeNum)
    
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
};

// Maps over pokemon returned by api fetch and dynamically builds elements into the dom
const displayPokemon = (pokemon) => {
    pokemon.map((individualPokemon) => {
        // creating all the elements that make a pokemon card, assigning classes and adding info from map as needed
        const listItem = document.createElement('li')
        listItem.classList.add( 'card-border')

        const cardDiv = document.createElement('div')
        cardDiv.classList.add('card')
        cardDiv.setAttribute('id', 'card')

        // // simple array for flicking between images on with event listener
        // const images = [individualPokemon.image, individualPokemon.backImage]
        
        // const image = document.createElement('img')
        // image.classList.add('card-image')
        // image.setAttribute('src', images[0])
        
        // let imageClick = true
        // // Event listener to change back and forth between images
        // image.addEventListener('click', () => {
        //     if (imageClick) {
        //         image.setAttribute('src', images[1])
        //         imageClick = false 
        //     } else {
        //         image.setAttribute('src', images[0])
        //         imageClick = true
        //     }  
        // })

        const image = document.createElement('div')
        image.classList.add('image-background')

        const imageFlip = document.createElement('div')
        imageFlip.classList.add('card-image')


        const imageFront = document.createElement('img')
        imageFront.classList.add('image-front')
        imageFront.setAttribute('src', individualPokemon.image)

        const imageBack = document.createElement('img')
        imageBack.classList.add('image-back')
        imageBack.setAttribute('src', individualPokemon.backImage)

        imageFlip.append(imageFront, imageBack)
        image.append(imageFlip)

        const titleDiv = document.createElement('div')
        titleDiv.classList.add('card-title')
        
        const idH2 = document.createElement('h2')
        idH2.classList.add('poke-id')
        idH2.setAttribute('id', 'poke-id')
        idH2.textContent = `${individualPokemon.id}.`

        const nameH2 = document.createElement('h2')
        nameH2.setAttribute('id', 'poke-name')
        nameH2.textContent = individualPokemon.name

        const typeP = document.createElement('p')
        typeP.classList.add('card-subtitle')
        typeP.textContent = `Type: ${individualPokemon.type}`

        // appending all the elements together
        titleDiv.append(idH2, nameH2)
       
        cardDiv.append(image, titleDiv, typeP)

        listItem.append(cardDiv)

        pokedex.append(listItem)
    })
}

//Currently loading quite slow with 150 API calls, might be good to have them load on scroll
fetchPokemon(150)

// TESTING BELOW HERE

//Dynamically building HTML to display pokemon
// const displayPokemon = (pokemon) => {
//     // Building HTML for each pokemon using .map
//     const pokemonHtmlString = pokemon.map((individualPokemon) => `
//     <li class="card-border">
//         <div class="card" id="card">
//             <img class="card-image" src="${individualPokemon.image}"/>
//             <div class="card-title">
//                 <h2 class="poke-id" id="poke-id">${individualPokemon.id}.</h2> 
//                 <h2 id="poke-name">${individualPokemon.name}</h2>
//             </div>
//             <p class="card-subtitle">Type: ${individualPokemon.type}</p>
//         </div>
//     </li>
//     `).join('') // converts .map array to a string so it can be fed into innerHTML
    
//     pokedex.innerHTML = pokemonHtmlString;
// }

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