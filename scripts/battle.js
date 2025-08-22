//take the information from localStorage
const storedUserPokemons = localStorage.getItem('selectedPokemons'); //Toma lo que está en el localStorage, los pokemon seleccionados por el jugador
const storedEnemyPokemons = localStorage.getItem('enemyPokemons'); //Toma los pokemon elegidos al azar por el enemigo

const userPokemonsArray = JSON.parse(storedUserPokemons || '[]'); //Guarda en un array los pokemon seleccionados por el usuario, array que vamos a manipular durante el desarrollo del juego
const enemyPokemonArray = JSON.parse(storedEnemyPokemons || '[]'); //Aquí se guarda los pokemon seleccionados por el enemigo.

console.log("Pokemons selected by the user: ", userPokemonsArray);
console.log("Pokemons selected by the enemy: ", enemyPokemonArray);