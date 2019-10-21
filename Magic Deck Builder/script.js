let cartas;
let set = 'https://api.magicthegathering.io/v1/cards?pageSize=20&set=eld';
let color;
let cartasFavoritas = [];
let carta;
let sideCarta;
let totalCartas = 0;


/* Filtro por coleccion*/

function filtro(value, count) {
    let dibujarCartas = document.getElementById('galeria');
    let dibujarPaginacion = document.getElementById('paginacion');
    let url = 'https://api.magicthegathering.io/v1/cards?page=' + count + '&pageSize=20&set=' + value;
    fetch(url)
        .then(cogerDatos => {
            totalCartas = cogerDatos.headers.get('Total-Count');
            totalCartas = parseInt(totalCartas);
            return cogerDatos.json()
        })
        .then(mostrarDatos => {
            cartas = mostrarDatos.cards;
            let cargarCartas = '';
            for (let i = 0; i < cartas.length; i++) {
                let name = cartas[i].name.replace("'", "&#92'");
                if (cartas[i].imageUrl !== undefined) {
                    cargarCartas += ` 
                    <div class="cartas">
                    <image onclick="favorita('${name}','${cartas[i].id}')" class = "imagen" src=${cartas[i].imageUrl} alt=${cartas[i].name}/>
                    </div>
                    `;
                }
            }
            dibujarCartas.innerHTML = cargarCartas;
            if (count === 1) {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="filtro('${value}', ${count + 1});return false;">></a></div>`;

            } else if (count === Math.round(totalCartas / 20)) {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="filtro('${value}', ${count - 1});return false;"><</a></div>`;

            } else {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="filtro('${value}', ${count - 1});return false;"><</a><a href="" onclick="filtro('${value}', ${count + 1});return false;">></a></div>`;
            }
            set = 'https://api.magicthegathering.io/v1/cards?pageSize=20&set=' + value;
        }).catch(error => {
            dibujarCartas.innerHTML = `<div class="cartas"><h1> Error: ${error} </h1></div>`;
        });
}

/* Filtro por color*/

function filtroColor(value, count) {
    let imagen = document.getElementById('checkMana' + value)
    imagen.src = `imagenes/Mana_${value}.png`;
    cambioColor();
    url = set + '&page=' + count + '&colorIdentity=' + value;
    fetch(url)
        .then(cogerDatos => {
            totalCartas = cogerDatos.headers.get('Total-Count');
            totalCartas = parseInt(totalCartas);
            return cogerDatos.json()
        })
        .then(mostrarDatos => {
            cartas = mostrarDatos.cards;
            let cargarCartas = '';
            let dibujarCartas = document.getElementById('galeria');
            let dibujarPaginacion = document.getElementById('paginacion');
            for (let i = 0; i < cartas.length; i++) {
                let name = cartas[i].name.replace("'", "&#92'");
                if (cartas[i].imageUrl !== undefined) {
                    cargarCartas += ` 
                <div class="cartas">
                <image onclick="favorita('${name}','${cartas[i].id}')" class = "imagen" src=${cartas[i].imageUrl} alt=${cartas[i].name}/>
                </div>`;
                }
            }
            dibujarCartas.innerHTML = cargarCartas;
            if (count === 1) {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="filtroColor('${value}', ${count + 1});return false;">></a></div>`;

            } else if (count === Math.round(totalCartas / 20)) {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="filtroColor('${value}', ${count - 1});return false;"><</a></div>`;

            } else {
                dibujarPaginacion.innerHTML += `<div class="paginacion"><a href="" onclick="filtroColor('${value}', ${count - 1});return false;"><</a><a href="" onclick="filtroColor('${value}', ${count + 1});return false;">></a></div>`;
            }
        }).catch(error => {
            dibujarCartas.innerHTML = `<div class="cartas"><h1> Error: ${error} </h1></div>`;
        });
}

/*Seleccion de cartas favoritas*/

let pos = 0;
function favorita(name, id) {
    cartasFavoritas.push({ name, id });
    let sideDeck = document.getElementById('listaCartas');
    sideDeck.innerHTML += `<div class = "deckList">
            <div>
            <button class="boton" onclick="quitarFavorito('${pos}')">-</button>
            </div>
            <div>
            <p class="sideImage" onmouseover= "sideImage('${id}')">${name}</p>
            </div>
            </div>`;
    pos = pos + 1;
}
function quitarFavorito(pos) {
    cartasFavoritas.splice(pos, 1)
    let sideDeck = document.getElementById('listaCartas');
    sideDeck.innerHTML = '';
    for (let i = 0; i < cartasFavoritas.length; i++) {
        if (cartasFavoritas.length !== 0) {
            sideDeck.innerHTML += `<div class = "deckList">
            <div>
            <button class="boton" onclick="quitarFavorito('${i}')">-</button>
            </div>
            <div>
            <p class="sideImage" onmouseover= "sideImage('${cartasFavoritas[i].id}')">${cartasFavoritas[i].name}</p>
            </div>`;
            pos = pos - 1;
        } else {
            sideDeck.innerHTML = '';
        }
    }

}
/*function sideImage(id) {
    fetch('https://api.magicthegathering.io/v1/cards?id=' + id)
        .then(cogerDatos => {
            return cogerDatos.json()
        })
        .then(mostrarDatos => {
            carta = mostrarDatos.cards;
            sideCarta = document.getElementsByClassName('sideImage').innerHTML = `<img src=${carta.imageUrl}/>`;
        });

}*/

/*Guardado de cartas favoritas*/

let seleccionMazo;
let miMazo = '';
let id;
let cartaGuardada = document.getElementById('mazoGuardado');

function guardarMazo() {
    window.localStorage.setItem('cartasFavoritas', JSON.stringify(cartasFavoritas));
    miMazo = '';
}
function mostrarMazo() {

    let recuperaMazo = JSON.parse(window.localStorage.getItem('cartasFavoritas'));
    for (let i = 0; i < recuperaMazo.length; i++) {
        id = recuperaMazo[i].id
        fetch('https://api.magicthegathering.io/v1/cards?id=' + id)
            .then(cogerDatos => {
                return cogerDatos.json()
            })
            .then(mostrarDatos => {
                seleccionMazo = mostrarDatos.cards
                miMazo = ` 
                <div class="cartas">
                <image  class = "imagen" src="${seleccionMazo[0].imageUrl}"/>
                </div>`;
                cartaGuardada.innerHTML += miMazo;
            }
            );
    }
}


