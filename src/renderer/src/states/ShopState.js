import { items } from "../gameResources/items";
import player from "../class/Player";
import { drawShopItems, drawShopMenu } from "../helpers/draw";

const shopOptions = ["Buy", "Sell", "Exit"];
let optionIndex = 0;
let selectedOption = "";

let keyupHandler = null; // Variable para almacenar la referencia del handler
let keysPressed = {}; // Mapa para almacenar el estado de las teclas

function createKeyDownHandler(stateMachine) {
    return function onKeyDown(e) {
        if (!selectedOption) {
            switch (e.key) {
                case 'ArrowUp':
                    optionIndex = (optionIndex - 1 + shopOptions.length) % shopOptions.length;
                    break;
                case 'ArrowDown':
                    optionIndex = (optionIndex + 1) % shopOptions.length;
                    break;
                case 'ArrowRight':
                    if (optionIndex == 0) {
                        optionIndex = 2;
                    } else if (optionIndex == 2) {
                        optionIndex = 0;
                    }
                    break;
                    case 'ArrowLeft':
                        if (optionIndex == 0) {
                            optionIndex = 2;
                        } else if (optionIndex == 2) {
                            optionIndex = 0;
                        }
                        break;
                case 'Enter':
                    selectedOption = shopOptions[optionIndex];
                    if(selectedOption == "Exit"){
                        selectedOption = "";
                        optionIndex = 0;
                        stateMachine.changeState("Playing");
                    }
                    break;
            }
        }
        if(selectedOption == "Buy"){
            switch (e.key) {
                case 'Escape':
                    selectedOption = "";
                    // selectedOptionIndex = (selectedOptionIndex - 1 + menuOptions.length) % menuOptions.length;
                    break;
            }
        }
        switch (e.key) {
            case 'Escape':
                //   selectedOptionIndex = (selectedOptionIndex - 1 + menuOptions.length) % menuOptions.length;
                alert();
                break;
        }
    }
}

const ShopState = (stateMachine) => {
    const shopKeyDownHandler = createKeyDownHandler(stateMachine);
    return {
        onEnter: () => {
            // Inicializa el handler de teclas
            keyupHandler = (e) => onShopKeyUp(e, stateMachine);
            window.addEventListener('keydown', shopKeyDownHandler);
        },
        onUpdate: () => { /* Manejar compras */ },
        onRender: (ctx) => {


            if (!selectedOption) {
                drawShopMenu(ctx, shopOptions, optionIndex);
            }else if(selectedOption == "Buy"){
                drawShopItems(ctx, items);
            }


            // // Dibujar los items
            // let y = 100;
            // for (const [key, item] of Object.entries(items)) {
            //     ctx.fillText(`${item.name}: ${item.cost}G`, 10, y);
            //     y += 30;
            // }
            // drawShop(ctx, items);
        },
        onExit: () => {
            // Elimina los listeners de teclas
            if (keyupHandler) {
                // window.removeEventListener('keyup', keyupHandler);
                window.removeEventListener('keydown', shopKeyDownHandler);
                keyupHandler = null;
            }

            // Limpia el estado de las teclas
            keysPressed = {};
        },
    }
};

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
