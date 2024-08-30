import audioManagerInstance from "../class/AudioManager";
import { mapEnemies } from "../maps/map1";
import { enemies } from "../maps/enemies";
import player from "../class/Player";
import { drawCombatOptions, drawEnemy, drawFightBottomBox, drawItemsBox, drawPlayer } from "../helpers/draw";

const keys = {}
const combatStates = ['selectAction', 'playerTurn', 'enemyTurn', 'resolve', 'endCombat'];
const playerActions = ['attack', 'defend', 'items', 'run'];
let currentPlayerAction = 0;
let playerAction = "";
let currentCombatState = combatStates[0];

const nextStep = () => {
    const currentIndex = combatStates.indexOf(currentCombatState);
    if (currentIndex === combatStates.length - 1) {
        currentCombatState = combatStates[0];
    } else {
        currentCombatState = combatStates[currentIndex + 1];
    }
}

function createKeyDownHandler(stateMachine) {
return function onKeyDown (e){
    keys[e.key] = true;

    if (currentCombatState === 'selectAction') {
        if (!playerAction) {
            switch (e.key) {
                case 'ArrowUp':
                    if (currentPlayerAction > 0) {
                        console.log("currentPlayerAction up => ", currentPlayerAction);
                        currentPlayerAction--;
                    } else {
                        currentPlayerAction = playerActions.length - 1;
                    }
                    break;
                case 'ArrowDown':
                    if (currentPlayerAction < playerActions.length - 1) {
                        currentPlayerAction++;
                    } else {
                        console.log("currentPlayerAction  down=> ", currentPlayerAction);

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
                    if (currentPlayerAction === 2) {
                        playerAction = playerActions[currentPlayerAction];
                    }
                    if (currentPlayerAction === 3) {
                        // playerAction = playerActions[currentPlayerAction];
                        stateMachine.changeState('Playing');
                    }
                    break;
            }
        }
        if (playerAction === 'items') {
            if (e.key === 'Escape') {
                playerAction = "";
            }
        }

    }

    // Ejemplo de acción del jugador
    // if (playerTurn) {
    //     if (e.key === 'a') {
    //         turnAction = 'attack'; // Establecer acción de ataque
    //         enemy.health -= 10; // Ejemplo de daño al enemigo
    //     } else if (e.key === 's') {
    //         player.hp -= 10; // Ejemplo de daño al jugador
    //     } else if (e.key === 'Escape') {
    //         stateMachine.changeState('Playing')
    //     }
    //     // Otros comandos de entrada del jugador
    // }
};
}

function createKeyUpHandler() {
    return function onKeyUp(e) {
        keys[e.key] = false;
    };
}


const Combat = (stateMachine) => {
    const fightKeyDownHandler = createKeyDownHandler(stateMachine);
    const fightKeyUpHandler = createKeyUpHandler();
    let battleStarted = false;
    let enemy = null;
    let playerTurn = true; // Indica si es el turno del jugador
    let turnAction = null; // Acción que el jugador está realizando

    // Inicializar el combate
    const initCombat = () => {
        console.log("Inicio del combate");
        // enemy = { /* Datos del enemigo */ };
        battleStarted = true;
        playerTurn = true; // El jugador comienza
    };

    // Procesar acción del jugador
    const processPlayerAction = () => {
        if (turnAction === 'attack') {
            console.log("Jugador ataca");
            // Aquí agregar la lógica de ataque del jugador
            // Por ejemplo, reducir la vida del enemigo
            enemy.health -= 10; // Ejemplo
        }
        // Otros tipos de acciones del jugador

        // Cambiar al turno del enemigo
        playerTurn = false;
        turnAction = null;
    };

    // Procesar acción del enemigo
    const processEnemyAction = () => {
        console.log("El enemigo ataca");
        // Aquí agregar la lógica de ataque del enemigo
        // Por ejemplo, reducir la vida del jugador
        player.health -= 10; // Ejemplo

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

        // Actualizar el combate según el turno
        if (playerTurn) {
            if (turnAction) {
                processPlayerAction();
            }
        } else {
            processEnemyAction();
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
        if (playerAction === 'items') {
            drawItemsBox(ctx);
        }
    };

    function selectBasedOnSpawnRate(array) {
        console.log("array => ", array);

        const totalSpawnRate = array.reduce((sum, item) => sum + item.spawn_rate, 0);
        let random = Math.random() * totalSpawnRate;
        random = random.toFixed(1);

        let acum = 0;
        for (let i = 0; i < array.length; i++) {
            acum += array[i].spawn_rate;
            if (random < acum) {
                return array[i];
            }
        }

    }

    const setupEnemy = () => {
        console.log("map => ", player.map);
        // const posible_enemies = mapEnemies[player.map].mobs;
        const posible_enemies = mapEnemies[player.map].mobs.map((mob) => enemies[mob]);


        const posible_lvl_range = mapEnemies[player.map].lvl_range;
        enemy = { ...selectBasedOnSpawnRate(posible_enemies) };
        enemy.level = Math.floor(Math.random() * (posible_lvl_range[1] - posible_lvl_range[0] + 1)) + posible_lvl_range[0];
        enemy.health = enemy.health + (enemy.health * enemy.healthMultiplier * enemy.level);
        enemy.attack = enemy.attack + enemy.attackMultiplier * enemy.level;
        enemy.defense = enemy.defense + enemy.defenseMultiplier * enemy.level;
        enemy.speed = enemy.speed + enemy.speedMultiplier * enemy.level;
        enemy.max_hp = enemy.health;
        // enemy.health = enemy.health -20;
    }

    function resetVars(){
        currentPlayerAction = 0;
        playerAction = "";
        currentCombatState = combatStates[0];
    }

    return {
        onEnter: () => {
            console.log('Entrando en el estado de combate');
            window.addEventListener('keydown', fightKeyDownHandler);
            window.addEventListener('keyup', fightKeyUpHandler);
            audioManagerInstance.play("battle");
            //setup enemy
            setupEnemy();
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
