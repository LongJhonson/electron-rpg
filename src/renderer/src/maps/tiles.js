const grass_tileset_path = '../assets/Texture/grass.png'; // Ruta a tu tileset
const stone_tileset_path = '../assets/Texture/stone.png'; // Ruta a tu tileset
const wall_tileset_path = '../assets/Texture/wall.png'; // Ruta a tu tileset
const chair2_path = '../assets/Texture/furniture/chair2.png'

const grass_tileset = new Image();
const stone_tileset = new Image();
const wall_tileset = new Image();
const chair2_tileset = new Image();
const table_tileset = new Image();
const plant_tileset = new Image();


grass_tileset.src = grass_tileset_path;
stone_tileset.src = stone_tileset_path;
wall_tileset.src = wall_tileset_path;
chair2_tileset.src = chair2_path;
table_tileset.src = '../assets/Texture/furniture/table.png';
plant_tileset.src = '../assets/Texture/plant.png';


export const tiles = {
    "1": {
        img: grass_tileset,
        x: 0,
        y: 0,
        coll: true
    },
    "0": {
        img: stone_tileset,
        x: 0,
        y: 0,
        coll: false
    },
    "2": {
        img: stone_tileset,
        x: 0,
        y: 2*32,
        coll: true
    },
    "3": {
        img: grass_tileset,
        x: 100,
        y: 100,
        coll: false
    },
    "4": {
        img: wall_tileset,
        x: 44,
        y: 119,
        coll: true
    },
    "5": {
        img: grass_tileset,
        x: 32,
        y: 32,
        coll: false
    },
    
}

export const objects = {
    "c2": {
        img: chair2_tileset,
        x: 0,
        y: 0
    },
    "t1": {
        img: table_tileset,
        x: 0,
        y: 0,
        coll: true
    },
    "p1": {
        img: plant_tileset,
        x: 94,
        y: 195,
        coll: false,
        combat: true
    },
}
