const soldier_tileset_path = '../assets/Texture/sprites/warrior_m.png' // Ruta a tu tileset
const goblin_tileset = new Image()
goblin_tileset.src = soldier_tileset_path

export const enemies = {
    goblin: {
        name: 'Goblin',
        health: 100,
        healthMultiplier: 0.2,
        attack: 10,
        attackMultiplier: 0.2,
        defense: 5,
        defenseMultiplier: 0.2,
        speed: 5,
        speedMultiplier: 0.2,
        experience: 50,
        experienceMultiplier: 0.2,
        gold: 20,
        goldMultiplier: 0.2,
        img: goblin_tileset,
        spawn_rate: 0.5,
    },
    lime: {
        name: 'Lime',
        health: 50,
        healthMultiplier: 0.2,
        attack: 5,
        attackMultiplier: 0.2,
        defense: 2,
        defenseMultiplier: 0.2,
        speed: 2,
        speedMultiplier: 0.2,
        experience: 20,
        experienceMultiplier: 0.2,
        gold: 5,
        goldMultiplier: 0.2,
        img: goblin_tileset,
        spawn_rate: 0.2,
    }
}
