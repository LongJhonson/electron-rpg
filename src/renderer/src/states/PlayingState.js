import { maps, mapObjects, mapAudio } from '../maps/map1'
import { transitions } from '../maps/transitions'
import { tiles, objects } from '../maps/tiles.js'
import audioManagerInstance from '../class/AudioManager.js'

// Tamaño de cada tile en píxeles
const TILE_SIZE = 32
const PLAYER_TILE_SIZE = 32
const PLAYER_TILE_ROW = 0 // Fila del tileset que contiene el jugador
const PLAYER_TILE_COL = 0

const soldier_tileset_path = '../assets/Texture/sprites/warrior_m.png' // Ruta a tu tileset
const soldier_tileset = new Image()
soldier_tileset.src = soldier_tileset_path


let map = maps.map1
let mapObject = mapObjects.map1
let currentMapName = 'map1';

// let map = maps.ruta1
// let mapObject = mapObjects.ruta1
// let currentMapName = 'ruta1';

let currentAudio = null;

function changeMap(newMap, newPlayerX, newPlayerY) {
  currentMapName = newMap;  // Actualiza el nombre del mapa actual
  map = maps[newMap];
  mapObject = mapObjects[newMap];
  player.x = newPlayerX * TILE_SIZE;
  player.y = newPlayerY * TILE_SIZE;
  player.prevX = player.x;
  player.prevY = player.y;

  // Cambiar la música según el nuevo mapa
  // audioManagerInstance.stop();
  audioManagerInstance.play(mapAudio[currentMapName]);
}

let transitionCooldown = 0;

function handleTransition() {
    if (transitionCooldown > 0) {
        transitionCooldown--;
        return;
    }

    const playerTileX = Math.floor(player.x / TILE_SIZE);
    const playerTileY = Math.floor(player.y / TILE_SIZE);

    if (
        playerTileY < 0 ||
        playerTileY >= map.length ||
        playerTileX < 0 ||
        playerTileX >= map[0].length
    ) {
        console.log('El jugador está fuera de los límites del mapa');
        return;
    }

    const tileValue = map[playerTileY][playerTileX];

    if (transitions[`${tileValue}`]) {
        const transition = transitions[`${tileValue}`];
        player.moving = false;
        // Evita la transición doble
        if (player.prevMap === transition.to && player.prevX === transition.x && player.prevY === transition.y) {
            return;
        }

        // Guardar la posición y el mapa anteriores
        player.prevMap = map;
        player.prevX = playerTileX;
        player.prevY = playerTileY;

        // Actualizar mapa y posición del jugador sin colisiones
        changeMap(transition.to, transition.x, transition.y);

        // Guardar la nueva posición del jugador
        localStorage.setItem(
            'playerPosition',
            JSON.stringify({ map: transition.to, x: transition.x, y: transition.y })
        );

        // Iniciar cooldown para la siguiente transición
        transitionCooldown = 20; // Ajusta este valor según lo que necesites
    } else {
        // console.log('No se encontró transición para el tile actual');
    }
}

const interactiveObjects = [
  { x: 2, y: 2, action: () => console.log('Interacted with t1') },
  // Otros objetos interactuables pueden ser añadidos aquí
];

function isPlayerInFrontOfObject(player, object) {
  const playerGridX = Math.floor(player.x / 32);
  const playerGridY = Math.floor(player.y / 32);

  // Asumiendo que el jugador tiene una propiedad `direction` que indica hacia dónde está mirando
  // 'up', 'down', 'left', 'right'
  switch (player.direction) {
    case 0:
      return playerGridX === object.x && playerGridY - 1 === object.y;
    case 2:
      return playerGridX === object.x && playerGridY + 1 === object.y;
    case 3:
      return playerGridX - 1 === object.x && playerGridY === object.y;
    case 1:
      return playerGridX + 1 === object.x && playerGridY === object.y;
    default:
      return false;
  }
}

// Datos del jugador
const player = {
  x: 1 * TILE_SIZE,
  y: 3 * TILE_SIZE,
  width: TILE_SIZE,
  height: TILE_SIZE,
  speed: 4,
  frameIndex: 0,
  tickCount: 0,
  frameSpeed: 10,
  spriteSheet: soldier_tileset,
  spriteWidth: PLAYER_TILE_SIZE,
  spriteHeight: PLAYER_TILE_SIZE,
  spriteColumns: 3,
  spriteRows: 1,
  direction: 1
}

let keys = {}

// Función para dibujar el mapa
function drawMap(ctx) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tile = tiles[`${map[y][x]}`]
      if (tile) {
        ctx.drawImage(
          tile.img,
          tile.x,
          tile.y,
          TILE_SIZE,
          TILE_SIZE,
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        )
      } else {
        ctx.fillStyle = 'pink'
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      }
    }
  }

  if (!mapObject) return

  for (let y = 0; y < mapObject.length; y++) {
    for (let x = 0; x < mapObject[y].length; x++) {
      let tile = objects[`${mapObject[y][x]}`]
      if (tile) {
        ctx.drawImage(
          tile.img,
          tile.x,
          tile.y,
          TILE_SIZE,
          TILE_SIZE,
          x * TILE_SIZE,
          y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        )
      }
    }
  }
}

// Función para dibujar el jugador
function drawPlayer(ctx) {
  const sx = player.frameIndex * player.spriteWidth
  const sy = player.direction * 37

  ctx.drawImage(
    player.spriteSheet,
    sx,
    sy,
    player.spriteWidth,
    player.spriteHeight,
    player.x,
    player.y,
    player.width,
    player.height
  )
}

// Función para actualizar la posición del jugador y manejar la animación
function updatePlayer(stateMachine) {
  if (player.moving) {
    player.moveProgress += player.speed / TILE_SIZE
    if (player.moveProgress >= 1) {
      player.moveProgress = 1
      player.moving = false
      player.x = player.moveEndX
      player.y = player.moveEndY

      const newPos = handleCollisionsBetween(
        player.prevX,
        player.prevY,
        player.x,
        player.y,
        stateMachine
      )
      player.x = newPos.x
      player.y = newPos.y
      player.frameIndex = 0
    } else {
      const prevX = player.x
      const prevY = player.y
      player.x = player.moveStartX + (player.moveEndX - player.moveStartX) * player.moveProgress
      player.y = player.moveStartY + (player.moveEndY - player.moveStartY) * player.moveProgress

      const collisionPos = handleCollisionsBetween(prevX, prevY, player.x, player.y, stateMachine)
      player.x = collisionPos.x
      player.y = collisionPos.y
    }
  } else {
    let moving = false
    let newX = player.x
    let newY = player.y

    if (keys['z']) {
      player.speed = 12
    } else {
      player.speed = 4
    }

    if (keys['ArrowUp']) {
      newY -= TILE_SIZE
      moving = true
      player.direction = 0
    }
    if (keys['ArrowDown']) {
      newY += TILE_SIZE
      moving = true
      player.direction = 2
    }
    if (keys['ArrowLeft']) {
      newX -= TILE_SIZE
      moving = true
      player.direction = 3
    }
    if (keys['ArrowRight']) {
      newX += TILE_SIZE
      moving = true
      player.direction = 1
    }

    if (moving) {
      player.moveStartX = player.x
      player.moveStartY = player.y
      player.moveEndX = newX
      player.moveEndY = newY
      player.moveProgress = 0
      player.moving = true

      player.prevX = player.x
      player.prevY = player.y
    }
  }

  if (player.moving) {
    player.tickCount++
    if (player.tickCount > player.frameSpeed) {
      player.tickCount = 0
      player.frameIndex++
      if (player.frameIndex >= player.spriteColumns) {
        player.frameIndex = 0
      }
    }
  } else {
    player.frameIndex = 0
  }
}

// Función para manejar las colisiones
function handleCollisionsBetween(startX, startY, endX, endY, stateMachine) {
  const left = Math.floor(Math.min(startX, endX) / TILE_SIZE)
  const right = Math.ceil(Math.max(startX + player.width, endX + player.width) / TILE_SIZE)
  const top = Math.floor(Math.min(startY, endY) / TILE_SIZE)
  const bottom = Math.ceil(Math.max(startY + player.height, endY + player.height) / TILE_SIZE)

  const mapHeight = map.length
  const mapWidth = map[0].length

  for (let y = top; y < bottom; y++) {
    if (y < 0 || y >= mapHeight) {
      return { x: startX, y: startY }
    }
    for (let x = left; x < right; x++) {
      if (x < 0 || x >= mapWidth) {
        return { x: startX, y: startY }
      }

      if (tiles[`${map[y][x]}`] && tiles[`${map[y][x]}`].coll) {
        return { x: startX, y: startY }
      }

      if (objects[`${mapObject[y][x]}`] && objects[`${mapObject[y][x]}`].coll) {
        return { x: startX, y: startY }
      }

      if (objects[`${mapObject[y][x]}`] && objects[`${mapObject[y][x]}`].combat) {
        const tileLeft = x * TILE_SIZE
        const tileRight = tileLeft + TILE_SIZE
        const tileTop = y * TILE_SIZE
        const tileBottom = tileTop + TILE_SIZE

        if (
          endX + player.width > tileLeft &&
          startX < tileRight &&
          endY + player.height > tileTop &&
          startY < tileBottom
        ) {
          if (Math.random() < 0.01) { //0.1 == 10% 0.01 == 1%
            keys = {}
            stateMachine.changeState('Fight')
            return { x: startX, y: startY }
          }
        }
      }
    }
  }

  return { x: endX, y: endY }
}

function onKeyDown(e) {
  keys[e.key] = true
  // Verificar si la tecla de interacción (por ejemplo, 'E') está presionada
  // Verificar si la tecla de interacción (por ejemplo, 'E') está presionada
  if (e.key === 'E') {
    interactiveObjects.forEach(object => {
      if (isPlayerInFrontOfObject(player, object)) {
        object.action();
      }
    });
  }
}

function onKeyUp(e) {
  keys[e.key] = false
}

const Playing = (stateMachine) => ({
  onEnter: () => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    //  Reproducir el audio correspondiente al mapa actual
     const currentAudio = mapAudio[currentMapName];
     audioManagerInstance.play(currentAudio);
  },
  onExit: () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    // audioManagerInstance.stop();
  },
  onUpdate: () => {
    updatePlayer(stateMachine)
    handleTransition()
    if (keys['Escape']) {
      keys['Escape'] = false
      stateMachine.changeState('Paused')
    }
  },
  onRender: (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawMap(ctx)
    drawPlayer(ctx)
  }
})

export default Playing
