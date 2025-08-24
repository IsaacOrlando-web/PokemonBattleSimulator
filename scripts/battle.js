//take the information from localStorage
const storedUserPokemons = localStorage.getItem('selectedPokemons'); //Toma lo que está en el localStorage, los pokemon seleccionados por el jugador
const storedEnemyPokemons = localStorage.getItem('enemyPokemons'); //Toma los pokemon elegidos al azar por el enemigo

let userPokemonsArray = JSON.parse(storedUserPokemons || '[]'); //Guarda en un array los pokemon seleccionados por el usuario, array que vamos a manipular durante el desarrollo del juego
let enemyPokemonArray = JSON.parse(storedEnemyPokemons || '[]'); //Aquí se guarda los pokemon seleccionados por el enemigo.

//Items del bolso para el usuario y para el enemigo
//Items del bolso para el usuario y para el enemigo
let userItems = [];
let enemyItems = [];

// Función principal que inicia el juego después de cargar items
function startGame() {
    console.log("Pokemons selected by the user: ", userPokemonsArray);
    console.log("Pokemons selected by the enemy: ", enemyPokemonArray);
    console.log("Items del usuario: ", userItems);
    console.log("Items del enemigo: ", enemyItems);
    
    // Aquí va toda la lógica de la pelea
}

// Carga los items y luego ejecuta el callback
async function loadItems(callback) {
    const url = "./data/items.json";
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        userItems = result.items;
        enemyItems = result.items;
        callback(); // Inicia el juego cuando los items están listos
        
    } catch (error) {
        console.error(error.message);
        userItems = [];
        enemyItems = [];
        callback(); // Inicia el juego incluso con error
    }
}

// Iniciar la carga y pasar la función de inicio
loadItems(startGame);