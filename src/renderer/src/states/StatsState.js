import player from "../class/Player";

function createKeyDownHandler(stateMachine) {
    return function onKeyDown(e) {
      switch(e.key) {
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
  }

//print basic state
const StatsState = (stateMachine) => {
    const statsKeyDownHandler = createKeyDownHandler(stateMachine);
    // const statsKeyUpHandler = createKeyUpHandler();
    return {
        onEnter: () => {
            console.log('Entering Stats State');
            window.addEventListener('keydown', statsKeyDownHandler);
        },
        onExit: () => {
            console.log('Exiting Stats State');
            window.removeEventListener('keydown', statsKeyDownHandler);
        },
        onUpdate: () => {
            // Lógica adicional si es necesario
        },
        onRender: (ctx) => {
            ctx.clearRect(300, 20, 600, canvas.height - 40);
            ctx.fillStyle = 'white';
            ctx.fillRect(300, 20, 600, canvas.height - 40);
            ctx.fillStyle = 'black';
            ctx.font = '36px sans-serif';
            // ctx.fillText('Stats', 10, 100);
            ctx.font = '24px sans-serif';
            ctx.fillText(`Level: ${player.getLvl()}`, 310, 50);
            ctx.fillText(`HP: ${player.hp}/${player.max_hp}`, 310, 100);
            ctx.fillText(`MP: ${player.mp}/${player.max_mp}`, 310, 150);
            ctx.fillText(`ATK: ${player.atk}`, 310, 200);
            ctx.fillText(`DEF: ${player.def}`, 310, 250);
            ctx.fillText(`SPD: ${player.spd}`, 310, 300);
            ctx.fillText(`EXP: ${player.exp}/${player.exp_to_lvl}`, 310, 350);
            ctx.fillText(`Gold: ${player.gold}`, 310, 400);
            // ctx.fillText(`Items:`, 10, 600);
            // player.items.forEach((item, index) => {
            //     ctx.fillText(`${item.name}: ${item.quantity}`, 10, 650 + index * 50);
            // });
        }
    }
}

export default StatsState;