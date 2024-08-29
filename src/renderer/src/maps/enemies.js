const soldier_tileset_path = '../assets/Texture/sprites/warrior_m.png' // Ruta a tu tileset
const goblin_tileset = new Image()
goblin_tileset.src = soldier_tileset_path

export const enemies = {
    goblin: {
        name: 'Goblin',
        health: 100,
        healthMultiplier: 0.5,
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
    }
}
