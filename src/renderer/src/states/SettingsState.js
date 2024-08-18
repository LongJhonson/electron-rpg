import audioManagerInstance from "../class/AudioManager";

// const menuOptions = ['Vol', 'Save', 'Load', 'Settings', 'Exit'];
const menuOptions = {
    vol: audioManagerInstance.getVolume(),
    test: "test",
    back: ""
}
let selectedOptionIndex = 0;
let keydownHandler = null; // Variable para almacenar la referencia del handler


const Settings = (stateMachine) => ({
    onEnter: () => {
        console.log('Entering Settings State');
        keydownHandler = (e) => onSettingsKeyDown(e, stateMachine);
        window.addEventListener('keydown', keydownHandler);
    },
    onExit: () => { 
        if (keydownHandler) {
            window.removeEventListener('keydown', keydownHandler);
            keydownHandler = null; // Limpia la referencia después de eliminar el listener
          }
    },
    onUpdate: () => { },
    onRender: (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '36px sans-serif';
        ctx.fillText('Settings', 100, 100);

        ctx.font = '24px sans-serif';
        let index = 0;
        for (const [key, value] of Object.entries(menuOptions)) {
            ctx.fillStyle = index === selectedOptionIndex ? 'blue' : 'black';
            ctx.fillText(`${key}: `, 100, 200 + index * 50);
            ctx.fillText(value, 150, 200 + index * 50);
            index++;
        }

    }
})

function onSettingsKeyDown(event, stateMachine) {
    switch (event.key) {
        case 'ArrowUp':
            selectedOptionIndex = (selectedOptionIndex - 1 + Object.keys(menuOptions).length) % Object.keys(menuOptions).length;
            break;
        case 'ArrowDown':
            selectedOptionIndex = (selectedOptionIndex + 1) % Object.keys(menuOptions).length;
            break;
        case 'ArrowRight':
            if (selectedOptionIndex == 0 &&  audioManagerInstance.getVolume() < 1) {
                let new_vol = audioManagerInstance.getVolume();

                new_vol += 0.1;
                new_vol = Math.round(new_vol * 10) / 10; // Redondea a 1 decimal

                audioManagerInstance.setVolume(new_vol);
                menuOptions.vol = audioManagerInstance.getVolume()
            }
            break;
        case 'ArrowLeft':
            if (selectedOptionIndex == 0 &&  audioManagerInstance.getVolume() > 0) {
                let new_vol = audioManagerInstance.getVolume();

                new_vol -= 0.1;
                new_vol = Math.round(new_vol * 10) / 10; // Redondea a 1 decimal

                audioManagerInstance.setVolume(new_vol);
                menuOptions.vol = audioManagerInstance.getVolume()
            }
            break;
        case 'Enter':
            selectMenuOption(selectedOptionIndex, stateMachine);
            break;
    }
}

function selectMenuOption(index, stateMachine) {
    switch (index) {
        case 0:
            break;
        case 1:
            // Implementar lógica para configuración
            break;
        case 2:
            console.log('Exit selected');
            // Implementar lógica para salir del juego
            stateMachine.changeState("MainMenu")
            break;
    }
}

export default Settings;