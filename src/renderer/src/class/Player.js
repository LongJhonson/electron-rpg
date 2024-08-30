const soldier_tileset_path = '../assets/Texture/sprites/warrior_m.png' // Ruta a tu tileset
const soldier_tileset = new Image()
soldier_tileset.src = soldier_tileset_path

// Tamaño de cada tile en píxeles
const TILE_SIZE = 32
const PLAYER_TILE_SIZE = 32

class Player {

    name= "Player"
    x= 1 * TILE_SIZE
    y= 3 * TILE_SIZE
    width= TILE_SIZE
    height= TILE_SIZE
    speed= 4
    frameIndex= 0
    tickCount= 0
    frameSpeed= 10
    spriteSheet= soldier_tileset
    spriteWidth= PLAYER_TILE_SIZE
    spriteHeight= PLAYER_TILE_SIZE
    spriteColumns= 3
    spriteRows= 1
    direction= 1
    map = "map1"
    img = soldier_tileset

    constructor() {
        this.lvl = 1;
        this.max_hp = 100;
        this.hp = 100;
        this.max_mp = 50;
        this.mp = 50;
        this.atk = 10;
        this.def = 5;
        this.spd = 5;
        this.exp = 0;
        this.exp_to_lvl = 100;
        this.gold = 0;
    }
    // Getters
    getLvl() {
        return this.lvl;
    }
    getMaxHp() {
        return this.max_hp;
    }
    getHp() {
        return this.hp;
    }
    getMaxMp() {
        return this.max_mp;
    }
    getMp() {
        return this.mp;
    }
    getAtk() {
        return this.atk;
    }
    getDef() {
        return this.def;
    }
    getSpd() {
        return this.spd;
    }
    getExp() {
        return this.exp;
    }
    getExpToLvl() {
        return this.exp_to_lvl;
    }
    getGold() {
        return this.gold;
    }
    // Setters
    setLvl(newLvl) {
        this.lvl = newLvl;
    }
    setMaxHp(newMaxHp) {
        this.max_hp = newMaxHp;
    }
    setHp(newHp) {
        this.hp = newHp;
    }
    setMaxMp(newMaxMp) {
        this.max_mp = newMaxMp;
    }
    setMp(newMp) {
        this.mp = newMp;
    }
    setAtk(newAtk) {
        this.atk = newAtk;
    }
    setDef(newDef) {
        this.def = newDef;
    }
    setSpd(newSpd) {
        this.spd = newSpd;
    }
    setExp(newExp) {
        this.exp = newExp;
    }
    setExpToLvl(newExpToLvl) {
        this.exp_to_lvl = newExpToLvl;
    }
    setGold(newGold) {
        this.gold = newGold;
    }
    // Methods
    gainExp(exp) {
        this.exp += exp;
        if (this.exp >= this.exp_to_lvl) {
            this.lvlUp();
        }
    }
    lvlUp() {
        this.lvl++;
        this.exp = 0;
        this.exp_to_lvl *= 1.5;
        this.max_hp += 10;
        this.hp = this.max_hp;
        this.max_mp += 5;
        this.mp = this.max_mp;
        this.atk += 2;
        this.def += 1;
        this.spd += 1;
    }
    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
        }
    }
    heal(heal) {
        this.hp += heal;
        if (this.hp > this.max_hp) {
            this.hp = this.max_hp;
        }
    }
    restoreMp(restore) {
        this.mp += restore;
        if (this.mp > this.max_mp) {
            this.mp = this.max_mp;
        }
    }
    spendMp(cost) {
        this.mp -= cost;
        if (this.mp < 0) {
            this.mp = 0;
        }
    }
    gainGold(gold) {
        this.gold += gold;
    }
    spendGold(cost) {
        this.gold -= cost;
    }

}

const player = new Player();
export default player;