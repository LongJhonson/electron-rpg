import audioManagerInstance from "../class/AudioManager";
import { mapEnemies } from "../maps/map1";
import { enemies } from "../maps/enemies";
import player from "../class/Player";

const keys = {}


const Combat = (stateMachine) => {
    let battleStarted = false;
    let enemy = null;
    let playerTurn = true; // Indica si es el turno del jugador
    let turnAction = null; // Acción que el jugador está realizando

    // Inicializar el combate
    const initCombat = () => {
        console.log("Inicio del combate");
        enemy = { /* Datos del enemigo */ };
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

        // Actualizar el combate según el turno
        if (playerTurn) {
            if (turnAction) {
                processPlayerAction();
            }
        } else {
            processEnemyAction();
        }

        // // Ejemplo de condiciones de victoria o derrota
        // if (enemy.health <= 0) {
        //     console.log("Victoria");
        //     stateMachine.changeState("Playing"); // Volver al estado de juego
        // } else if (player.health <= 0) {
        //     console.log("Derrota");
        //     stateMachine.changeState("GameOver"); // Cambiar a un estado de Game Over
        // }
    };

    // Función para renderizar el combate
    const renderCombat = (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar al enemigo
        if (enemy) {
            // Ejemplo: ctx.drawImage(enemy.sprite, enemy.x, enemy.y);
        }

        // Aquí puedes dibujar otros elementos de la interfaz de combate
    };

    // Función para manejar eventos de teclado específicos del combate
    const onKeyDown = (e) => {
        keys[e.key] = true;

        // Ejemplo de acción del jugador
        if (playerTurn) {
            if (e.key === 'a') {
                turnAction = 'attack'; // Establecer acción de ataque
            } else if (e.key === 'Escape') {
                stateMachine.changeState('Playing')
            }
            // Otros comandos de entrada del jugador
        }
    };

    const onKeyUp = (e) => {
        keys[e.key] = false;
    };

    const setupEnemy = () => {
        console.log("map => ", player.map);
        const posible_enemies = mapEnemies[player.map].mobs;
        const posible_lvl_range = mapEnemies[player.map].lvl_range;
        const randomEnemy = Math.floor(Math.random() * posible_enemies.length);
        enemy = enemies[posible_enemies[randomEnemy]];
        // enemy.level = Math.floor(Math.random() * (posible_lvl_range[1] - posible_lvl_range[0] + 1)) + posible_lvl_range[0];
        enemy.level = 2;
        enemy.health = enemy.health + (enemy.healthMultiplier * enemy.level + enemy.health);
        enemy.attack = enemy.attack + enemy.attackMultiplier * enemy.level;
        enemy.defense = enemy.defense + enemy.defenseMultiplier * enemy.level;
        enemy.speed = enemy.speed + enemy.speedMultiplier * enemy.level;
        console.log("enemy => ", enemy);
    }

    return {
        onEnter: () => {
            console.log('Entrando en el estado de combate');
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);
            audioManagerInstance.play("battle");
            //setup enemy
            setupEnemy();
        },
        onExit: () => {
            console.log('Saliendo del estado de combate');
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            audioManagerInstance.stop();
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
