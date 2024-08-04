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

// let map = maps.map1;
// let mapObject = mapObjects.map1;
let map = maps.map2;
let mapObject = mapObjects.map2;

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
    // x: 1 * TILE_SIZE,
    // y: 3 * TILE_SIZE,
    x: 3 * TILE_SIZE,
    y: 7 * TILE_SIZE,
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
function updatePlayer(stateMachine) {
    if (player.moving) {
        player.moveProgress += player.speed / TILE_SIZE;
        if (player.moveProgress >= 1) {
            player.moveProgress = 1;
            player.moving = false;
            player.x = player.moveEndX;
            player.y = player.moveEndY;

            const newPos = handleCollisionsBetween(player.prevX, player.prevY, player.x, player.y, stateMachine);
            player.x = newPos.x;
            player.y = newPos.y;
            player.frameIndex = 0;
        } else {
            const prevX = player.x;
            const prevY = player.y;
            player.x = player.moveStartX + (player.moveEndX - player.moveStartX) * player.moveProgress;
            player.y = player.moveStartY + (player.moveEndY - player.moveStartY) * player.moveProgress;

            const collisionPos = handleCollisionsBetween(prevX, prevY, player.x, player.y, stateMachine);
            player.x = collisionPos.x;
            player.y = collisionPos.y;
        }
    } else {
        let moving = false;
        let newX = player.x;
        let newY = player.y;

        if (keys['z']) {
            player.speed = 12;
        } else {
            player.speed = 4;
        }

        if (keys['ArrowUp']) {
            newY -= TILE_SIZE;
            moving = true;
            player.direction = 0;
        }
        if (keys['ArrowDown']) {
            newY += TILE_SIZE;
            moving = true;
            player.direction = 2;
        }
        if (keys['ArrowLeft']) {
            newX -= TILE_SIZE;
            moving = true;
            player.direction = 3;
        }
        if (keys['ArrowRight']) {
            newX += TILE_SIZE;
            moving = true;
            player.direction = 1;
        }

        if (moving) {
            player.moveStartX = player.x;
            player.moveStartY = player.y;
            player.moveEndX = newX;
            player.moveEndY = newY;
            player.moveProgress = 0;
            player.moving = true;

            player.prevX = player.x;
            player.prevY = player.y;
        }
    }

    if (player.moving) {
        player.tickCount++;
        if (player.tickCount > player.frameSpeed) {
            player.tickCount = 0;
            player.frameIndex++;
            if (player.frameIndex >= player.spriteColumns) {
                player.frameIndex = 0;
            }
        }
    } else {
        player.frameIndex = 0;
    }
}


// Función para manejar las colisiones
function handleCollisionsBetween(startX, startY, endX, endY, stateMachine) {
    const left = Math.floor(Math.min(startX, endX) / TILE_SIZE);
    const right = Math.ceil(Math.max(startX + player.width, endX + player.width) / TILE_SIZE);
    const top = Math.floor(Math.min(startY, endY) / TILE_SIZE);
    const bottom = Math.ceil(Math.max(startY + player.height, endY + player.height) / TILE_SIZE);

    const mapHeight = map.length;
    const mapWidth = map[0].length;

    for (let y = top; y < bottom; y++) {
        if (y < 0 || y >= mapHeight) {
            return { x: startX, y: startY }; // Fuera de los límites del mapa
        }
        for (let x = left; x < right; x++) {
            if (x < 0 || x >= mapWidth) {
                return { x: startX, y: startY }; // Fuera de los límites del mapa
            }

            // Comprobar si el tile es colisionable
            if (tiles[`${map[y][x]}`] && tiles[`${map[y][x]}`].coll) {
                return { x: startX, y: startY };
            }

            // Comprobar si el objeto es colisionable
            if (objects[`${mapObject[y][x]}`] && objects[`${mapObject[y][x]}`].coll) {
                return { x: startX, y: startY };
            }

            // Comprobar combates solo si el jugador está dentro del tile
            if (objects[`${mapObject[y][x]}`] && objects[`${mapObject[y][x]}`].combat) {
                const tileLeft = x * TILE_SIZE;
                const tileRight = tileLeft + TILE_SIZE;
                const tileTop = y * TILE_SIZE;
                const tileBottom = tileTop + TILE_SIZE;

                if (endX + player.width > tileLeft && startX < tileRight &&
                    endY + player.height > tileTop && startY < tileBottom) {
                    if (Math.random() < 0.1) { // Probabilidad de encuentro
                        keys = {};
                        stateMachine.changeState("Fight");
                        return { x: startX, y: startY }; // Detener movimiento si inicia combate
                    }
                }
            }
        }
    }

    return { x: endX, y: endY };
}


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
