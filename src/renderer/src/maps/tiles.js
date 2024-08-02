const grass_tileset_path = '../assets/Texture/grass.png'; // Ruta a tu tileset
const stone_tileset_path = '../assets/Texture/stone.png'; // Ruta a tu tileset
const chair2_path = '../assets/Texture/furniture/chair2.png'

const grass_tileset = new Image();
const stone_tileset = new Image();
const chair2_tileset = new Image();


grass_tileset.src = grass_tileset_path;
stone_tileset.src = stone_tileset_path;
chair2_tileset.src = chair2_path;


export const tiles = {
    "1": {
        img: grass_tileset,
        x: 0,
        y: 0
    },
    "0": {
        img: stone_tileset,
        x: 0,
        y: 0
    },
    "c2": {
        img: chair2_tileset,
        x: 0,
        y: 0
    },
}

// ctx.drawImage(
//     grass_tileset,
//     0, 0, TILE_SIZE, TILE_SIZE, // Parte del tileset a dibujar
//     x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE // Donde dibujar en el canvas
// );