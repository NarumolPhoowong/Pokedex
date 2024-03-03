let allPokemons = [];
let currentPokemon = 0;
let maxPokemon = 200;
let minPokemon = 20;

async function loadPokemon() {
    await renderPokedex();
}

async function renderPokedex() {
    for (let id = 1; id <= minPokemon; id++) {
        let url = `https://pokeapi.co/api/v2/pokemon/` + id;
        let response = await fetch(url);
        let currentPokemonData = await response.json();
        allPokemons.push({
            "name": currentPokemonData['name'],
            "id": id,
            "types": currentPokemonData['types'],
            "images": currentPokemonData['sprites']['other']['dream_world']['front_default'],
            "abilities": currentPokemonData['abilities'],
            "height": currentPokemonData['height'],
            "weight": currentPokemonData['weight'],
            "stats": currentPokemonData['stats']
        });
    }

    getPokemonName();
    getPokemonCard();
}

function getPokemonName() {
    const container = document.getElementById('pokedex');
    container.innerHTML = '';
    for (let i = 0; i < allPokemons.length; i++) {
        let pokemon = allPokemons[i];
        container.innerHTML += pokeTemplate(pokemon);
    }
}

function pokeTemplate(pokemon) {
    let types = pokemon.types;
    let bgColor = colors[types[0].type.name];

    return `
    <div onclick="openCard(${pokemon.id})" class="poke-box" style="background-color: ${bgColor};">
        <img class="poke-bg" src="img/bg-pokeball.png">
        <div class="poke-name-id">
            <h1>${capitalize(pokemon.name)}</h1>
            <b># ${pokemon.id}</b>
        </div>
        <div class="typ-box">
            ${types.map(type => `<b class="typ">${capitalize(type.type.name)}</b>`).join('')}
        </div>
        <img class="poke-img" src="${pokemon.images}">
    </div>`;
}

function getPokemonCard() {
    const card = allPokemons[currentPokemon];
    let types = card['types'];
    let abilities = card['abilities'];
    let stats = card['stats'];
    let bgColor = colors[types[0]['type']['name']];

    const pokecard = document.getElementById('pokemonCard');
    pokecard.innerHTML = '';
    pokecard.innerHTML += `
    <div class="poke-info" style="background-color: ${bgColor};">
        <div class="infos-box">
             <img onclick="closeCard()" class="close-icon" src="img/close.png">
             <h2>${capitalize(card['name'])}</h2>
            <h2>#${card['id']}</h2>
        </div>
             <div class="typ-info-card">
                 ${types.map(type => `<b class="typ">${capitalize(type.type.name)}</b>`).join('')}
             </div>
             <div class="img-box">
                 <img onclick="back()" class="next-icon" src="img/left.png">
                 <img class="img-card" src="${card['images']}">
                 <img onclick="next()" class="next-icon" src="img/right.png">
             </div>
    </div>
    <div class="details-container">
         <div class="about-box">
             <h3>About</h3>
                 <div class="about" style="color: ${bgColor};">
                     <div class="about-info">
                         <div class="infos">
                             <p class="info-box"> <img class="about-icon" src="img/height.png">Height</p>
                             <p>${(card['height'] / 10).toString().replace('.', ',')} m</p>
                         </div>
                         <div class="infos">
                             <p class="info-box"> <img class="about-icon" src="img/weight.png">Weight</p>
                             <p>${(card['weight'] / 10).toString().replace('.', ',')} kg</p>
                         </div>
                         <div class="infos">
                             <p class="info-box">Abilities</p>
                             ${abilities.map(ability => `<p>${capitalize(ability.ability.name)}</p>`).join('')}
                        </div>
                 </div>
        </div>
         <h3>Base Stats</h3>
         <div class="stats">
         <div>
                 ${stats.map(stat => `<b>${capitalize(stat.stat.name)}</b>
                 <div class="progress">
                     <div class="progress-bar" role="progressbar" style="width:${stat.base_stat}px; background-color: ${bgColor};" aria-valuenow="${stat.base_stat}" aria-valuemin="0" aria-valuemax="100">${stat.base_stat}</div>
                 </div>
             `).join('<br>')}
         </div>
         </div>
    </div>
    `;
}

function next() {
    if (currentPokemon < allPokemons.length - 1) {
        currentPokemon++;
        getPokemonCard();
    }
}

function back() {
    if (currentPokemon > 0) {
        currentPokemon--;
        getPokemonCard();
    }
}

function openCard(id) {
    currentPokemon = id - 1; 
    document.getElementById('pokemonCard').classList.remove('d-none');
    document.getElementById('pokemonHome').classList.add('d-none');
    getPokemonCard();
}


function closeCard() {
    document.getElementById('pokemonCard').classList.add('d-none');
    document.getElementById('pokemonHome').classList.remove('d-none');
}

function filterNames() {
    let search = document.getElementById('search').value.toLowerCase();

    const container = document.getElementById('pokedex');
    container.innerHTML = '';
    for (let i = 0; i < allPokemons.length; i++) {
        let pokemon = allPokemons[i];
        if (pokemon.name.toLowerCase().includes(search) || pokemon.types.some(type => type.type.name.toLowerCase().includes(search))) {
            container.innerHTML += pokeTemplate(pokemon);
        }
    }
}

async function loadMore() {
    document.getElementById('load').classList.add('d-none');
    for (let id = 21; id <= maxPokemon; id++) {
        let url = `https://pokeapi.co/api/v2/pokemon/` + id;
        let response = await fetch(url);
        let currentPokemonData = await response.json();
        allPokemons.push({
            "name": currentPokemonData['name'],
            "id": id,
            "types": currentPokemonData['types'],
            "images": currentPokemonData['sprites']['other']['dream_world']['front_default'],
            "abilities": currentPokemonData['abilities'],
            "height": currentPokemonData['height'],
            "weight": currentPokemonData['weight'],
            "stats": currentPokemonData['stats']
        });
    }

    getPokemonName();
    getPokemonCard();
}

