import player from "../class/Player";

let selectedOptionIndex = 0;
const menuOptions = ['Resume','Save', 'Load', 'Settings', 'Exit'];
let keydownHandler = null; // Variable para almacenar la referencia del handler

const Pause = (stateMachine) => ({
  onEnter: () => {
    console.log('Entering Main Menu State');
    keydownHandler = (e) => onPauseKeyDown(e, stateMachine);
    window.addEventListener('keydown', keydownHandler);
  },
  onExit: () => {
    console.log('Exiting Main Menu State');
    if (keydownHandler) {
      window.removeEventListener('keydown', keydownHandler);
      keydownHandler = null; // Limpia la referencia después de eliminar el listener
    }
  },
  onUpdate: () => {
    // Lógica adicional si es necesario
  },
  onRender: (ctx) => {
    ctx.clearRect(0, 0, 200, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '36px sans-serif';
    ctx.fillText('Pause', 10, 100);

    ctx.font = '24px sans-serif';
    menuOptions.forEach((option, index) => {
      ctx.fillStyle = index === selectedOptionIndex ? 'blue' : 'black';
      ctx.fillText(option, 10, 200 + index * 50);
    });
  }
});

function onPauseKeyDown(event, stateMachine) {
  switch(event.key) {
    case 'ArrowUp':
      selectedOptionIndex = (selectedOptionIndex - 1 + menuOptions.length) % menuOptions.length;
      break;
    case 'ArrowDown':
      selectedOptionIndex = (selectedOptionIndex + 1) % menuOptions.length;
      break;
    case 'Enter':
      selectMenuOption(selectedOptionIndex, stateMachine);
      break;
      case 'Escape':
        stateMachine.changeState("Playing")
        break;
  }
}

function selectMenuOption(index, stateMachine) {
  switch(index) {
    case 0:
      console.log('Start Game selected');
      stateMachine.changeState('Playing'); // Cambiar al estado de juego
      break;
      case 1: //save
      window.database.updatePlayer(player)
      localStorage.setItem("gameData", btoa(JSON.stringify({map: "map2", x: 5, y: 4})))
      break;
      case 2: 
      console.log("Load game --> ", JSON.parse(atob(localStorage.getItem("gameData"))))
        break;
    case 3:
      console.log('Settings selected');
      // Implementar lógica para configuración
      break;
    case 4:
      console.log('Exit selected');
      // Implementar lógica para salir del juego
      stateMachine.changeState("MainMenu")
      break;
  }
}

export default Pause;