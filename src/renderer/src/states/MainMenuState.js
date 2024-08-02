let selectedOptionIndex = 0;
const menuOptions = ['Start Game', 'Settings', 'Exit'];
let keydownHandler = null; // Variable para almacenar la referencia del handler

const MainMenu = (stateMachine) => ({
  onEnter: () => {
    console.log('Entering Main Menu State');
    keydownHandler = (e) => onMainMenuKeyDown(e, stateMachine);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '36px sans-serif';
    ctx.fillText('Main Menu', 100, 100);

    ctx.font = '24px sans-serif';
    menuOptions.forEach((option, index) => {
      ctx.fillStyle = index === selectedOptionIndex ? 'blue' : 'black';
      ctx.fillText(option, 100, 200 + index * 50);
    });
  }
});

function onMainMenuKeyDown(event, stateMachine) {
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
  }
}

function selectMenuOption(index, stateMachine) {
  switch(index) {
    case 0:
      console.log('Start Game selected');
      stateMachine.changeState('Playing'); // Cambiar al estado de juego
      break;
    case 1:
      console.log('Settings selected');
      // Implementar lógica para configuración
      break;
    case 2:
      console.log('Exit selected');
      // Implementar lógica para salir del juego
      window.close();
      break;
  }
}

export default MainMenu;