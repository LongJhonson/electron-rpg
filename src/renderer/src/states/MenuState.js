let selectedOptionIndex = 0;
const menuOptions = ['Start Game', 'Settings', 'Exit'];
let keydownHandler = null; // Variable para almacenar la referencia del handler

export const MenuState = {
    onEnter: () => console.log('Entering Menu State'),
    onExit: () => console.log('Exiting Menu State'),
    onUpdate: () => console.log('Updating Menu State'),
    onRender: (ctx) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = '48px sans-serif';
      ctx.fillText('Menu', 100, 100);
    }
  }