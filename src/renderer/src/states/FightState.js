import audioManagerInstance from "../class/AudioManager";
import { mapEnemies } from "../maps/map1";
import { enemies } from "../maps/enemies";
import player from "../class/Player";
import { drawCombatOptions, drawEnemy, drawFightBottomBox, drawItemsBox, drawPlayer } from "../helpers/draw";

const keys = {}
const combatStates = ['selectAction', 'resolve', 'userInput', 'endCombat'];
// const combatStates = ['selectAction', 'playerTurn', 'enemyTurn', 'resolve', 'endCombat'];
const playerActions = ['attack', 'defend', 'items', 'run'];
let currentPlayerAction = 0;
let playerAction = "";
let currentCombatState = combatStates[0];
let selectedItem = 0;
let playerItem = "";

let output_messages = [];

const nextStep = () => {
    const currentIndex = combatStates.indexOf(currentCombatState);
    if (currentIndex === combatStates.length - 1) {
        currentCombatState = combatStates[0];
    } else {
        currentCombatState = combatStates[currentIndex + 1];
    }
}

function createKeyDownHandler(stateMachine, enemy) {
    return function onKeyDown(e) {
        keys[e.key] = true;

        if (currentCombatState === 'selectAction') {
            if (!playerAction) {
                switch (e.key) {
                    case 'ArrowUp':
                        if (currentPlayerAction > 0) {
                            currentPlayerAction--;
                        } else {
                            currentPlayerAction = playerActions.length - 1;
                        }
                        break;
                    case 'ArrowDown':
                        if (currentPlayerAction < playerActions.length - 1) {
                            currentPlayerAction++;
                        } else {

                            currentPlayerAction = 0;
                        }
                        break;
                    case 'ArrowRight':
                        if (currentPlayerAction === 0) {
                            currentPlayerAction = 2;
                        } else if (currentPlayerAction === 1) {
                            currentPlayerAction = 3;
                        } else if (currentPlayerAction === 2) {
                            currentPlayerAction = 0;
                        } else if (currentPlayerAction === 3) {
                            currentPlayerAction = 1;
                        }
                        break;

                    case 'ArrowLeft':
                        if (currentPlayerAction === 0) {
                            currentPlayerAction = 2;
                        } else if (currentPlayerAction === 1) {
                            currentPlayerAction = 3;
                        } else if (currentPlayerAction === 2) {
                            currentPlayerAction = 0;
                        } else if (currentPlayerAction === 3) {
                            currentPlayerAction = 1;
                        }
                        break;

                    case 'Enter':
                        if (currentPlayerAction === 0) {
                            playerAction = playerActions[currentPlayerAction];
                            nextStep();
                        }
                        if (currentPlayerAction === 2) {
                            playerAction = playerActions[currentPlayerAction]; //items
                        }
                        if (currentPlayerAction === 3) {
                            // playerAction = playerActions[currentPlayerAction];
                            stateMachine.changeState('Playing');
                        }
                        break;
                }
            } else if (playerAction === 'items') {
                if (e.key === 'Escape') {
                    playerAction = "";
                }
                if (e.key === 'ArrowUp') {
                    if (selectedItem > 0) {
                        selectedItem--;
                    } else {
                        selectedItem = player.items.length - 1;
                    }
                }
                if (e.key === 'ArrowDown') {
                    if (selectedItem < player.items.length - 1) {
                        selectedItem++;
                    } else {
                        selectedItem = 0;
                    }
                }
                if (e.key === 'Enter') {
                    if (playerItem == "") {
                        console.log("enter pressed item", playerAction, playerItem)
                        const item = player.items[selectedItem];
                        if (item.type === 'consumable') {
                            playerAction = "item";
                            playerItem = item;
                            console.log("playerItem", playerItem);
                            // player.items[selectedItem].use(player);
                            // player.items[selectedItem].quantity--;
                            // if(player.items[selectedItem].quantity === 0){
                            //     player.items.splice(selectedItem, 1);
                            //     selectedItem = 0;
                            // }
                            // playerAction = "";
                            nextStep();
                        }
                    }
                }
            }

        }
        if (currentCombatState === 'userInput') {
            if (e.key === 'Enter') {
                // setTimeout(() => {
                currentCombatState = combatStates[0];
                // }, 1000);
            }
        }
        if (currentCombatState === 'resolve') {

        }
    };
}

function createKeyUpHandler() {
    return function onKeyUp(e) {
        keys[e.key] = false;
    };
}


const Combat = (stateMachine) => {
    let enemy = null;
    const fightKeyDownHandler = createKeyDownHandler(stateMachine, enemy);
    const fightKeyUpHandler = createKeyUpHandler();
    let battleStarted = false;
    let playerTurn = true; // Indica si es el turno del jugador
    let turnAction = null; // Acción que el jugador está realizando

    // Inicializar el combate
    const initCombat = () => {
        // enemy = { /* Datos del enemigo */ };
        battleStarted = true;
        playerTurn = true; // El jugador comienza
    };

    // Procesar acción del jugador
    const processPlayerAction = () => {
        if (playerAction === 'attack') {
            const atack_power = player.atk;
            const defense_power = enemy.defense;
            //create a random number based on the enemy defense power
            const random = Math.floor(Math.random() * defense_power);
            const damage = Math.round(atack_power - random);
            //redondear el daño
            output_messages.push(`You attack the enemy and deal ${damage} damage`);
            enemy.health -= damage;

        }
        if (playerAction === 'item') {
            if (playerItem.type === 'consumable') {
                let stat = playerItem.stat;
                player[stat] += playerItem.value;
                if (player[stat] > player[`max_${stat}`]) {
                    player[stat] = player[`max_${stat}`];
                }
                playerItem.quantity--;
                if (playerItem.quantity === 0) {
                    player.items.splice(selectedItem, 1);
                    selectedItem = 0;
                }
                output_messages.push(`You use ${playerItem.name}`);
                playerAction = "";
                playerItem = "";
            }
        }
        // Cambiar al turno del enemigo
        playerTurn = false;
    };

    // Procesar acción del enemigo
    const processEnemyAction = () => {
        const atack_power = enemy.attack;
        const defense_power = player.def;
        //create a random number based on player defense power
        const random = Math.floor(Math.random() * defense_power);
        const damage = Math.round(atack_power - random);
        //redondear el daño
        output_messages.push(`The enemy attacks you and deals ${damage} damage`);
        player.hp -= damage;


        // Cambiar al turno del jugador
        playerTurn = true;
    };

    // Función para actualizar el estado de combate
    const updateCombat = () => {
        if (!battleStarted) {
            initCombat();
        }

        if (!enemy) return;
        if (enemy.health <= 0) {
            stateMachine.changeState("Playing");
        }

        if (currentCombatState === 'selectAction') {
            output_messages = [];
        }

        if (currentCombatState === 'resolve') {
            processPlayerAction();
            processEnemyAction();
            if (enemy.health <= 0) {
                currentCombatState = combatStates[3];
            } else {
                currentCombatState = combatStates[2];
                playerAction = "";
            }
        }
        if (currentCombatState === 'userInput') {
        }
        if (currentCombatState === 'endCombat') {
            output_messages.push(`You defeated the enemy!`);
            //enemy.attack = enemy.attack + enemy.attackMultiplier * enemy.level; 
            
            output_messages.push(`You gained ${enemy.experience + enemy.experienceMultiplier * enemy.level} experience points`);
            player.gainExp(enemy.experience + (enemy.experience * enemy.experienceMultiplier) * enemy.level);

        }
    };

    // Función para renderizar el combate
    const renderCombat = (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar al enemigo
        if (enemy) {
            drawEnemy(ctx, enemy);
        }

        drawFightBottomBox(ctx);

        drawPlayer(ctx, player);

        if (currentCombatState === 'selectAction') {
            drawCombatOptions(ctx, currentPlayerAction);
        }
        if (currentCombatState === 'resolve' || currentCombatState === 'userInput') {
            //show combat result message until player press enter
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            //print output messages
            for (let i = 0; i < output_messages.length; i++) {
                ctx.fillText(output_messages[i], 500, 625 + i * 30);
            }
        }
        if (playerAction === 'items') {
            drawItemsBox(ctx, player.items, selectedItem);
        }
    };

    function selectBasedOnSpawnRate(array) {

        const totalSpawnRate = array.reduce((sum, item) => sum + item.spawn_rate, 0);
        console.log({ totalSpawnRate });
        let random = Math.random() * totalSpawnRate;
        console.log({ random });
        random = random.toFixed(1);
        console.log({ random });

        let acum = 0;
        for (let i = 0; i < array.length; i++) {
            acum += array[i].spawn_rate;
            console.log({ acum });
            if (random <= acum) {
                console.log({ i });
                console.log({ array });
                return array[i];
            }
        }

    }

    const setupEnemy = () => {
        // const posible_enemies = mapEnemies[player.map].mobs;
        const posible_enemies = mapEnemies[player.map].mobs.map((mob) => enemies[mob]);


        const posible_lvl_range = mapEnemies[player.map].lvl_range;
        enemy = { ...selectBasedOnSpawnRate(posible_enemies) };
        console.log({ enemy });
        enemy.level = Math.floor(Math.random() * (posible_lvl_range[1] - posible_lvl_range[0] + 1)) + posible_lvl_range[0];
        enemy.health = enemy.health + (enemy.health * enemy.healthMultiplier * enemy.level);
        enemy.attack = enemy.attack + enemy.attackMultiplier * enemy.level;
        enemy.defense = enemy.defense + enemy.defenseMultiplier * enemy.level;
        enemy.speed = enemy.speed + enemy.speedMultiplier * enemy.level;
        enemy.max_hp = enemy.health;
        // enemy.health = enemy.health -20;
    }

    function resetVars() {
        currentPlayerAction = 0;
        playerAction = "";
        currentCombatState = combatStates[0];
    }

    return {
        onEnter: () => {
            console.log('Entrando en el estado de combate');
            setupEnemy();
            window.addEventListener('keydown', fightKeyDownHandler);
            window.addEventListener('keyup', fightKeyUpHandler);
            audioManagerInstance.play("battle");
            //setup enemy
        },
        onExit: () => {
            console.log('Saliendo del estado de combate');
            window.removeEventListener('keydown', fightKeyDownHandler);
            window.removeEventListener('keyup', fightKeyUpHandler);
            audioManagerInstance.stop();
            enemy = null;
            resetVars();
        },
        onUpdate: () => {
            updateCombat();
        },
        onRender: (ctx) => {
            renderCombat(ctx);
        }
    };
};

export default Combat;
