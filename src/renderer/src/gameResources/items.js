export const items = {
    "potion": {
        "type": "consumable",
        "name": "Potion",
        "description": "Heals 50 HP",
        "value": 50,
        "stat": "hp",
        "cost": 5,
        use: function(player) {
            player.hp += this.value;
            if(player.hp > player.max_hp) {
                player.hp = player.max_hp;
            }
        }
    },
    "mana_potion": {
        "type": "consumable",
        "name": "Mana Potion",
        "description": "Restores 25 MP",
        "value": 25,
        "stat": "mp",
        "cost": 10,
        use: function(player) {
            player.mp += this.value;
            if(player.mp > player.max_mp) {
                player.mp = player.max_mp;
            }
        }
    }
}