//take the information from localStorage
const storedUserPokemons = localStorage.getItem('selectedPokemons'); //Toma lo que está en el localStorage, los pokemon seleccionados por el jugador
const storedEnemyPokemons = localStorage.getItem('enemyPokemons'); //Toma los pokemon elegidos al azar por el enemigo

let userPokemonsArray = JSON.parse(storedUserPokemons || '[]'); //Guarda en un array los pokemon seleccionados por el usuario, array que vamos a manipular durante el desarrollo del juego
let enemyPokemonArray = JSON.parse(storedEnemyPokemons || '[]'); //Aquí se guarda los pokemon seleccionados por el enemigo.

//Items del bolso para el usuario y para el enemigo
//Items del bolso para el usuario y para el enemigo
let userItems = [];
let enemyItems = [];

//Turno true
let turno = true;

// Función principal que inicia el juego después de cargar items
function startGame() {
    console.log("Pokemons selected by the user: ", userPokemonsArray);
    console.log("Pokemons selected by the enemy: ", enemyPokemonArray);
    console.log("Items del usuario: ", userItems);
    console.log("Items del enemigo: ", enemyItems);
    
    setTimeout(() => {
    battle(userPokemonsArray, enemyPokemonArray);
}, 10000);
    // Aquí va toda la lógica de la pelea
    
}

function battle(pokemonsUser, pokemonsEnemy) {
    console.log("Dentro de la batalla");
    while (pokemonsUser.length > 0 || pokemonsEnemy.length > 0) {
        //pokemon actual, enemy y user
        let currentUserPokemon = pokemonsUser[0];
        let currentEnemyPokemon = pokemonsEnemy[0];
        let option = 0; //opción de que hacer

        console.log(`The current fight is beetween: Usuario(${currentUserPokemon.name}) Enemigo(${currentEnemyPokemon.name})`);

        //Si es turno true, turno del pokemonActualUser
        if (turno === true) {
            //mostrar opciones, con un switch(1.atacar, 2.Mochila, 3.pokemon)
            console.log("turno de usuario");
            option = prompt("1.Fight,   2.Bag,  3.Pokemon");
            console.log(option);
            
            switch (option) {
                case '1'://En caso que quiera atacar
                    //take all the moves inside an array
                    let atacks = currentUserPokemon.moves;
                    //Muestra todos los ataques
                    console.log("atacks: ");
                    for (let i = 0; i < atacks.length; i++) {
                        console.log(`${i+1}`, atacks[i].name)
                    }

                    //Selecciona el ataque
                    let numeroAtaque = parseInt(prompt("Selecciona por un numeor el ataque:"));
                    let ataqueSeleccionado = atacks[numeroAtaque - 1]; //El ataque que seleccionó el usuario

                    //nombre del ataque y cuanto daño hizo
                    let nameAtaque = ataqueSeleccionado.name;
                    let damageAtaque = ataqueSeleccionado.damage;
                    console.log(`Ataque seleccionado: ${nameAtaque}`);
                    console.log(`daño: ${damageAtaque}`);
                    currentEnemyPokemon.currentHp -= damageAtaque;//Programar caso de atacar, quitar cantidad de vida.

                    console.log(`${currentEnemyPokemon.name} ha recivido ${damageAtaque} de ataque, ahora tiene ${currentEnemyPokemon.currentHp} de vida`);
                    if (currentEnemyPokemon.currentHp <= 0) {//condicional si el otro pokemondelEnemigo tiene vida igual o menor a 0, se cambia de pokemon.
                        console.log(`${currentEnemyPokemon.name} ha sido eliminado`);
                        pokemonsEnemy.shift();
                    }
                    break;
            
                default:
                    break;
            }
                
            //cambio de turno
            turno = false;
            
        }else{
            console.log(`Turno de ${currentEnemyPokemon.name}`);
            turno = true;
        }
        //caso contrario, turno del pokemonActualEnemy
    }
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