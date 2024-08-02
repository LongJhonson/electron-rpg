// Tamaño de cada tile en píxeles
const TILE_SIZE = 32;
const PLAYER_TILE_SIZE = 32;
const PLAYER_TILE_ROW = 0;   // Fila del tileset que contiene el jugador
const PLAYER_TILE_COL = 0;

const soldier_tileset_path = '../assets/Texture/sprites/warrior_m.png'; // Ruta a tu tileset


const soldier_tileset = new Image();

import { maps, mapObjects } from '../maps/map1';
import { transitions } from '../maps/transitions';
import { tiles, objects } from '../maps/tiles.js'

soldier_tileset.src = soldier_tileset_path;
// let currentMap = maps.map1;

let map = maps.map1;
let mapObject = mapObjects.map1;

function changeMap(newMap, newPlayerX, newPlayerY) {
    map = maps[newMap];
    mapObject = mapObjects[newMap];
    player.x = newPlayerX * TILE_SIZE;
    player.y = newPlayerY * TILE_SIZE;
}

function handleTransition() {
    const playerTileX = Math.floor(player.x / TILE_SIZE);
    const playerTileY = Math.floor(player.y / TILE_SIZE);
    const tileValue = map[playerTileY][playerTileX];
    if (transitions[`${tileValue}`]) {
        const transition = transitions[`${tileValue}`];
        changeMap(transition.to, transition.x, transition.y);
        localStorage.setItem("playerPosition", JSON.stringify({ map: transition.to, x: transition.x, y: transition.y }))
    }

}

// Datos del jugador
const player = {
    x: 1 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    speed: 4,
    frameIndex: 0, // Cuadro actual de la animación
    tickCount: 0, // Contador para controlar la velocidad de la animación
    frameSpeed: 10, // Velocidad de cambio de cuadro (frames por segundo)
    spriteSheet: soldier_tileset, // Imagen del spritesheet
    spriteWidth: PLAYER_TILE_SIZE, // Ancho de cada cuadro
    spriteHeight: PLAYER_TILE_SIZE, // Alto de cada cuadro
    spriteColumns: 3, // Número de columnas en el spritesheet
    spriteRows: 1, // Número de filas en el spritesheet
    direction: 1
};

let keys = {};

// Función para dibujar el mapa
function drawMap(ctx) {
    for (let y = 0; y < map.length; y++) { //loop for ground layer
        for (let x = 0; x < map[y].length; x++) {
            let tile = tiles[`${map[y][x]}`];
            if (tile) {
                ctx.drawImage(
                    tile.img,
                    tile.x, tile.y, TILE_SIZE, TILE_SIZE, // Parte del tileset a dibujar
                    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE // Donde dibujar en el canvas
                )
            } else {
                ctx.fillStyle = "pink";
                ctx.fillRect(
                    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE,
                    32, 32
                )
            }
        }
    }
    if (!mapObject) return
    for (let y = 0; y < mapObject.length; y++) { //loop for objects layer
        for (let x = 0; x < mapObject[y].length; x++) {
            let tile = objects[`${mapObject[y][x]}`];
            if (tile) {
                ctx.drawImage(
                    tile.img,
                    tile.x, tile.y, TILE_SIZE, TILE_SIZE, // Parte del tileset a dibujar
                    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE // Donde dibujar en el canvas
                )
            }
        }
    }
}

// Función para dibujar el jugador
function drawPlayer(ctx) {
    const sx = player.frameIndex * player.spriteWidth; // Coordenada x en el spritesheet
    const sy = player.direction * 37; // Coordenada y en el spritesheet
    // const sy = PLAYER_TILE_ROW * player.spriteHeight; // Coordenada y en el spritesheet

    // console.log("Drawing char ",sx, sy)

    ctx.drawImage(
        player.spriteSheet, // Imagen del spritesheet
        sx, sy, // Coordenadas del cuadro en el spritesheet
        // 0, player.direction * 32,
        player.spriteWidth, player.spriteHeight, // Tamaño del cuadro en el spritesheet
        player.x, player.y, // Coordenadas en el canvas
        player.width, player.height // Tamaño en el canvas
    );
}

// Función para actualizar la posición del jugador y manejar la animación
function updatePlayer() {
    let newX = player.x;
    let newY = player.y;

    let moving = false;

    if (keys['z']) {
        player.speed = 12;
    } else {
        player.speed = 4;
    }

    if (keys['ArrowUp']) {
        newY -= player.speed;
        moving = true;
        player.direction = 0
    }
    if (keys['ArrowDown']) {
        newY += player.speed;
        moving = true;
        player.direction = 2
    }
    if (keys['ArrowLeft']) {
        newX -= player.speed;
        moving = true;
        player.direction = 3
    }
    if (keys['ArrowRight']) {
        newX += player.speed;
        moving = true;
        player.direction = 1
    }

    // Manejo de colisiones
    const newPos = handleCollisions(newX, newY);
    player.x = newPos.x;
    player.y = newPos.y;

    // Manejo de la animación del sprite
    if (moving) {
        player.tickCount++;
        if (player.tickCount > player.frameSpeed) {
            player.tickCount = 0;
            player.frameIndex++;
            if (player.frameIndex >= player.spriteColumns) {
                player.frameIndex = 0; // Reiniciar la animación
            }
        }
    } else {
        player.frameIndex = 0; // Mostrar el primer cuadro si no se mueve
    }
}

// Función para manejar las colisiones
function handleCollisions(newX, newY) {
    // Determinar las coordenadas de los tiles que el jugador ocupará
    const left = Math.floor(newX / TILE_SIZE);
    const right = Math.floor((newX + player.width - 1) / TILE_SIZE); // Ajustar por el borde derecho
    const top = Math.floor(newY / TILE_SIZE);
    const bottom = Math.floor((newY + player.height - 1) / TILE_SIZE); // Ajustar por el borde inferior

    // Obtener las dimensiones del mapa actual
    const mapHeight = map.length;
    const mapWidth = map[0].length;

    // Comprobar las colisiones
    for (let y = top; y <= bottom; y++) {
        // Asegurarse de que y esté dentro de los límites del mapa
        if (y < 0 || y >= mapHeight) {
            return { x: player.x, y: player.y };
        }
        for (let x = left; x <= right; x++) {
            // Asegurarse de que x esté dentro de los límites del mapa
            if (x < 0 || x >= mapWidth) {
                return { x: player.x, y: player.y };
            }

            // Comprobar si el tile es colisionable
            if (tiles[`${map[y][x]}`] && tiles[`${map[y][x]}`].coll) {
                return { x: player.x, y: player.y };
            }else if(objects[`${mapObject[y][x]}`] && objects[`${mapObject[y][x]}`].coll){
                return { x: player.x, y: player.y };
            }
        }
    }

    // Si no hay colisión, retornar la nueva posición
    return { x: newX, y: newY };
}

// Función para manejar eventos de teclado
function onKeyDown(e) {
    keys[e.key] = true;
}

function onKeyUp(e) {
    keys[e.key] = false;
}

// Estado Playing
const Playing = (stateMachine) => ({
    onEnter: () => {
        console.log('Entering Playing State');
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        // console.log(localStorage.getItem("map"))
        // if(localStorage.getItem("playerPosition")){
        //     const data = JSON.parse(localStorage.getItem("playerPosition"));
        //     console.log("load data --> ", data)
        //     changeMap(data.map, data.x, data.y)
        // }
    },
    onExit: () => {
        console.log('Exiting Playing State');
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
    },
    onUpdate: () => {
        updatePlayer();
        handleTransition(); // Verificar y manejar transiciones de mapa
        if (keys['Escape']) {
            keys['Escape'] = false;
            stateMachine.changeState('Paused');
        }
    },
    onRender: (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap(ctx);
        drawPlayer(ctx);
    }
});

export default Playing;
