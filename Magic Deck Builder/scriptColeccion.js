/* Apartado Colección completa*/

let sets;
let cartasColeccion;
let totalCartas = 0;
fetch('https://api.magicthegathering.io/v1/sets')
    .then(cogerDatos => {
        totalCartas = cogerDatos.headers.get('Total-Count');
        totalCartas = parseInt(totalCartas);
        return cogerDatos.json()
    })
    .then(mostrarDatos => {
        sets = mostrarDatos.sets;
        let listaSet = document.getElementById('desplegableSets');
        let lista = '';
        for (let i = 0; i < sets.length; i++) {
            lista += `<option value="${sets[i].code}">
                ${sets[i].name}
                </option>`;
        }
        listaSet.innerHTML = lista;

    });
function seleccionSet(count) {
    setValue = document.getElementById('desplegableSets').value;
    let cartasDevolucion = 'https://api.magicthegathering.io/v1/cards?set=' + setValue + '&page=' + count;
    window.fetch(cartasDevolucion)
        .then(cogerDatos => {
            return cogerDatos.json()
        })
        .then(mostrarDatos => {
            cartasColeccion = mostrarDatos.cards;
            let cargarCartas = '';
            let dibujarCartas = document.getElementById('cartasColeccion');
            let dibujarPaginacion = document.getElementById('paginacionColeccion');
            for (let i = 0; i < cartasColeccion.length; i++) {
                if (cartasColeccion[i].imageUrl !== undefined) {

                    cargarCartas += ` 
                    <div class="cartas">
                    <image class = "imagen" src="${cartasColeccion[i].imageUrl}" alt="${cartasColeccion[i].name}"/>
                    </div>`;
                }else{
                    cargarCartas +=` 
                    <div class="cartas">
                    <p>no hay imagen para mostrar</p>
                    </div>`;
                }
            }
            dibujarCartas.innerHTML = cargarCartas;
            if (count === 1) {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="seleccionSet(${count + 1});return false;">></a></div>`;

            } else if (count === Math.round(totalCartas / 20)) {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="seleccionSe(${count - 1});return false;"><</a></div>`;

            } else {
                dibujarPaginacion.innerHTML = `<div class="paginacion"><a href="" onclick="seleccionSe(${count - 1});return false;"><</a><a href="" onclick="filtroColor(${count + 1});return false;">></a></div>`;
            }
        }).catch(error => {
            dibujarCartas.innerHTML = `<div class="cartas"><h1> Error: ${error} </h1></div>`;
        });
}
