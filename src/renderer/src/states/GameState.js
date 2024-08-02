const TILE_SIZE = 32;
const PLAYER_TILE_SIZE = 32; 
const PLAYER_TILE_ROW = 0;   // Fila del tileset que contiene el jugador
const PLAYER_TILE_COL = 0; 

const gameState = {
    currentMap: 'map1',
    player: {
        x: 1 * TILE_SIZE,
        y: 1 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        speed: 4,
        frameIndex: 0,
        tickCount: 0,
        frameSpeed: 10,
        spriteSheet: new Image(),
        spriteWidth: 32,
        spriteHeight: 32,
        spriteColumns: 4,
        spriteRows: 1
    },
    inventory: [],
    // otros estados globales
};

gameState.player.spriteSheet.src = '../assets/Texture/sprites/warrior_m.png';

export default gameState