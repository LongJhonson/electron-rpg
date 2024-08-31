const goblin_tileset_path = '../assets/Texture/sprites/ranger_m.png' // Ruta a tu tileset
const goblin_tileset = new Image()
goblin_tileset.src = goblin_tileset_path

const lime_tileset_path = '../assets/Texture/sprites/healer_f.png' // Ruta a tu tileset
const lime_tileset = new Image()
lime_tileset.src = lime_tileset_path

const exp_lime_tileset_path = '../assets/Texture/sprites/healer_m.png' // Ruta a tu tileset
const exp_lime_tileset = new Image()
exp_lime_tileset.src = exp_lime_tileset_path

export const enemies = {
    goblin: {
        name: 'Goblin',
        health: 50,
        healthMultiplier: 0.2,
        attack: 10,
        attackMultiplier: 0.2,
        defense: 5,
        defenseMultiplier: 0.2,
        speed: 5,
        speedMultiplier: 0.2,
        experience: 20,
        experienceMultiplier: 0.2,
        gold: 20,
        goldMultiplier: 0.2,
        img: goblin_tileset,
        spawn_rate: 0.5,
    },
    lime: {
        name: 'Lime',
        health: 20,
        healthMultiplier: 0.2,
        attack: 5,
        attackMultiplier: 0.2,
        defense: 2,
        defenseMultiplier: 0.2,
        speed: 2,
        speedMultiplier: 0.2,
        experience: 10,
        experienceMultiplier: 0.2,
        gold: 5,
        goldMultiplier: 0.2,
        img: lime_tileset,
        spawn_rate: 0.2,
    }, 
    exp_lime: {
        name: 'exp_Lime',
        health: 20,
        healthMultiplier: 0.2,
        attack: 5,
        attackMultiplier: 0.2,
        defense: 2,
        defenseMultiplier: 0.2,
        speed: 2,
        speedMultiplier: 0.2,
        experience: 80,
        experienceMultiplier: 0.2,
        gold: 5,
        goldMultiplier: 0.2,
        img: exp_lime_tileset,
        spawn_rate: 0.9,
    }
}
