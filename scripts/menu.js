const url = "https://pokeapi.co/api/v2/pokemon/";
const allPokemonContainer = document.getElementById("all-pokemon-container"); // Contenedor donde se muestran todos los pokemon que el usuario puede seleccionar
const selectedPokemonContainer = document.getElementById("three-pokemon-selected");
const startButton = document.getElementById('start-button');

let allPokemons = []; // Variable para almacenar todos los Pokémon
let selectedPokemons = []; // Variable para almacenar los Pokémon seleccionados
let enemyPokemons = []; //Almacena los pokemon del enemigo
const saved = localStorage.getItem('selectedPokemons');
selectedPokemons = saved ? JSON.parse(saved) : [];



main();

async function getPokemonData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allPokemons = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const details = await res.json();
                return details; // Guarda toda la info del Pokémon
            })
        );
        console.log(allPokemons);
        return allPokemons;
    }catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function main() {
    const pokemons = await getPokemonData();
    allPokemons = pokemons;
    console.log("all pokemons saved into the array: ", allPokemons);
    if (pokemons) {
        displayAllPokemons(pokemons);
        displaySelectedPokemons(selectedPokemons);

        if (enemyPokemons.length === 0) {
            selectEnemyPokemons(pokemons);
        } else {
            console.log("Enemigos cargados desde localStorage:", enemyPokemons);
        }
    }
}

function selectEnemyPokemons(pokemons) {
    // Selecciona tres pokemon randoms del arreglo
    const enemyPokemonsArray = [];
    const indicesSeleccionados = new Set();
    
    // Asegurarse de que hay suficientes Pokémon
    const cantidad = Math.min(3, pokemons.length);
    
    while (indicesSeleccionados.size < cantidad) {
        const indiceAleatorio = Math.floor(Math.random() * pokemons.length);
        if (!indicesSeleccionados.has(indiceAleatorio)) {
            indicesSeleccionados.add(indiceAleatorio);
            enemyPokemonsArray.push(pokemons[indiceAleatorio]);
        }
    }
    
    // Guarda en la variable global
    enemyPokemons = enemyPokemonsArray;
    
    // Guarda en localStorage
    localStorage.setItem('enemyPokemons', JSON.stringify(enemyPokemons));
    
    console.log("Pokémon enemigos seleccionados:", enemyPokemons);
    return enemyPokemonsArray;
}

//Muestra los pokemon seleccionados por el usuario.
function displaySelectedPokemons(pokemons){
    selectedPokemonContainer.innerHTML = "";
    pokemons.forEach(pokemon => {
        const pokemonContainer = document.createElement("div");
        pokemonContainer.className = "selected-pokemons-container";
        pokemonContainer.innerHTML = `
            <img class="selected-pokemon-pokeball" src="images/pixelPokeball.png"></img>
            <img class="selected-pokemon-image" src="${pokemon.sprites.front_shiny}"></img>
            <p class="selected-pokemon-name">${pokemon.name}</p>
            <button id="selected-pokemon-remove">X</button>
        `;

        selectedPokemonContainer.appendChild(pokemonContainer);
    });
}

function displayAllPokemons(pokemons) {
    allPokemonContainer.innerHTML = "";
    pokemons.forEach(pokemon => {
        let tipos = pokemon.types.map(type => 
        `<p class="tipo ${type.type.name}">${type.type.name}</p>`);
        tipos = tipos.join("");

        const pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-card");
        pokemonCard.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div class="pokemon-tipos">
                    ${tipos}
                </div>
            <h3 class="pokemon-name">${pokemon.name.toUpperCase()}</h3>
            <p class="pokemon-info">Height: ${pokemon.height}</p>
            <p class="pokemon-info">Weight: ${pokemon.weight}</p>
        `;
        //Create the button to select pokemon
        const isSaved = selectedPokemons.some(p => p.name === pokemon.name); //Check if the pokemon is already in the Array "selectedPokemons"
        const saveButton = document.createElement('button');
        saveButton.className = "select-button";
        if(isSaved){
            saveButton.id = "alreadySelected";
            saveButton.textContent = "✅"
        } else {
            saveButton.id = "selectButton";
            saveButton.textContent = "Select";
        }


        allPokemonContainer.appendChild(pokemonCard);
        pokemonCard.appendChild(saveButton);
    });
}

//Event for the select Button
allPokemonContainer.addEventListener('click', function(event) {
    const saveBtn = event.target.closest('#selectButton');
    const removeBtn = event.target.closest('#alreadySelected');
    const card = event.target.closest('.pokemon-card');

    if (selectedPokemons.length !== 3) {
        if (saveBtn && card) {
            const pokemonName = card.querySelector('.pokemon-name')?.textContent.toLowerCase();
            console.log("Nombre del pokemon ", pokemonName);
            console.log("El arreglo dentro del botón select", allPokemons); //Funciona, toma el arreglo de todos los pokemon
            const pokemonObj = allPokemons.find(p => p.name === pokemonName); //Está como undefined
            console.log(pokemonObj);
            

            if (pokemonObj && !selectedPokemons.some(saved => saved.name === pokemonObj.name)) {
                selectedPokemons.push({ ...pokemonObj }); // Guarda copia del objeto Pokémon
                console.log(selectedPokemons);
                try {
                    localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
                    displayAllPokemons(allPokemons); // Actualiza la vista
                } catch (error) {
                    console.error('Error al guardar en localStorage:', error);
                }
            }
            location.reload();
        } else if (removeBtn && card) {
            const pokemonName = card.querySelector('.pokemon-name')?.textContent.toLowerCase();
            selectedPokemons = selectedPokemons.filter(saved => saved.name !== pokemonName);

            try {
                localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
                displayAllPokemons(allPokemons); // Actualiza la vista
            } catch (error) {
                console.error('Error al guardar en localStorage:', error);
            }
        }
    }
    
});


//Botón para sacar pokemon del equipo
selectedPokemonContainer.addEventListener('click', function(event) {
    const removeBtn = event.target.closest('#selected-pokemon-remove');
    const card = event.target.closest('.selected-pokemons-container');

    if (removeBtn && card) {
        const pokemonName = card.querySelector('.selected-pokemon-name')?.textContent.toLowerCase();
        selectedPokemons = selectedPokemons.filter(saved => saved.name !== pokemonName);
        try {
            localStorage.setItem('selectedPokemons', JSON.stringify(selectedPokemons));
            console.log(selectedPokemons);
            location.reload();
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }
    
});

startButton.addEventListener('click', () =>{
    if(selectedPokemons.length === 3){
        window.open("battle.html", "_self");
    }else {
        alert("Select three Pokemons");
    }
});