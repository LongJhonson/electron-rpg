let keyupHandler = null; // Variable para almacenar la referencia del handler
let keysPressed = {}; // Mapa para almacenar el estado de las teclas

const ShopState = (stateMachine) => ({
    onEnter: () => {
        // Inicializa el handler de teclas
        keyupHandler = (e) => onShopKeyUp(e, stateMachine);
        window.addEventListener('keyup', keyupHandler);
    },
    onUpdate: () => { /* Manejar compras */ },
    onRender: (ctx) => { 
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Tienda', 10, 40);
    },
    onExit: () => {
        // Elimina los listeners de teclas
        if (keyupHandler) {
            window.removeEventListener('keyup', keyupHandler);
            keyupHandler = null;
        }

        // Limpia el estado de las teclas
        keysPressed = {}; 
    },
});

function onShopKeyUp(event, stateMachine) {
    keysPressed[event.key] = false; // Marca la tecla como soltada

    switch (event.key) {
        case 'Escape':
            if (keyupHandler) {
                window.removeEventListener('keyup', keyupHandler);
                keyupHandler = null;
            }
            stateMachine.changeState('Playing');
            break;
        case 'Enter':
            console.log('Enter key released');
            break;
    }
}

export default ShopState;
