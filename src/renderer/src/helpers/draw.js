import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";

export function drawFightBottomBox(ctx) {
    // dibujar un rectangulo vacio blanco que ocupe la parte inferior de la pantalla
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.rect(10, 600, 1261, 128);
    ctx.stroke();
}

export function drawEnemy(ctx, enemy) {
    //set font
    ctx.font = "25px Arial";
    // Ejemplo: ctx.drawImage(enemy.sprite, enemy.x, enemy.y);
    ctx.fillStyle = 'white';
    ctx.fillText(`${enemy.name} (${enemy.level})`, 10, 25);
    ctx.fillText(`Level: ${enemy.level}`, 10, 50);
    ctx.fillText(`${enemy.max_hp} / ${enemy.health}`, 10, 75);
    //draw health bar of enemy
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 80, 100, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 80, 100 * (enemy.health / enemy.max_hp), 10);
    //draw first 32x32 of the sprite double size
    ctx.drawImage(enemy.img, 32, 72, 32, 32, 10, 100, 64, 64);
    // ctx.drawImage(enemy.img, 0, 0, 32, 32, 10, 100, 32, 32);
}

export function drawPlayer(ctx, player) {
    //set font 
    ctx.font = "20px Arial";
    ctx.fillText(`lvl: ${player.lvl}`, 20, 630);
    //draw health bar of player
    ctx.fillStyle = 'red';
    ctx.fillRect(20, 640, 200, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(20, 640, 200 * (player.hp / player.max_hp), 10);
    ctx.fillStyle = 'white';
    // ctx.fillText(`${player.name} (${player.lvl})`, 20, 610 );
    ctx.fillText(`${player.max_hp} / ${player.hp}`, 20, 675);

    //player xp bar
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    ctx.rect(20, 700, 200, 10);
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.fillRect(20, 700, 200 * (player.exp / player.exp_to_lvl), 10);
    //draw first 32x32 of the sprite
    ctx.drawImage(player.img, 0, 0, 32, 32, 10, 245, 32, 32);
}

function drawShopBackground(ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.rect(110, 10, 1161, 580);
    ctx.stroke();
    //fill the box with light gray

    ctx.fillStyle = 'black';
    ctx.fillRect(111, 11, 1160, 579);
}

export function drawItemsBox(ctx, items, selectedItem = 0) {
    ctx.font = "20px Arial";
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.rect(110, 10, 1161, 580);
    ctx.stroke();
    //fill the box with light gray

    ctx.fillStyle = 'black';
    ctx.fillRect(111, 11, 1160, 579);

    //draw the items
    ctx.fillStyle = 'white';
    ctx.fillText("Items", 150, 35);
    ctx.fillText("Quantity", 340, 35);
    ctx.fillText("Description", 470, 35);
    //draw lines to separate items
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
        ctx.moveTo(110, 45);
        ctx.lineTo(1270, 45);
    ctx.stroke();
    //draw lines to separate columns
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
    ctx.moveTo(320, 10);
    ctx.lineTo(320, 590);
    ctx.moveTo(450, 10);
    ctx.lineTo(450, 590);
    ctx.stroke();

    //set font

    for (let i = 0; i < items.length; i++) {
        ctx.fillText(items[i].name, 150, 70 + 30 * i);
        ctx.fillText(items[i].quantity, 380, 70 + 30 * i);
        ctx.fillText(items[i].description, 470, 70 + 30 * i);
    }

    //draw arrow pointing to the right on the current item
    ctx.beginPath();
ctx.fillStyle = 'white';
ctx.lineWidth = 1;
ctx.moveTo(120 , 50 + 30 * selectedItem); // Punto inicial
ctx.lineTo(140 , 60 + 30 * selectedItem); // Punto superior derecho
ctx.lineTo(120 , 70 + 30 * selectedItem); // Punto inferior derecho
ctx.lineTo(120 , 50+ 30 * selectedItem); // Volver al punto inicial
ctx.fill();
}

export const drawShopMenu = (ctx, options, optionIndex = 0) => {

    ctx.font = "20px Arial";
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.rect(480, 600, 450, 200);
    ctx.stroke();
    //fill the box with light gray

    ctx.fillStyle = 'black';
    ctx.fillRect(480, 600, 450, 200);

    // drawShopBackground(ctx);
    ctx.font = "30px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Buy", 520, 640);
    ctx.fillText("Sell", 520, 700);
    ctx.fillText("Exit", 850, 640);
    // for (let i = 0; i < options.length; i++) {
    //     ctx.fillText(options[i], 520, 640 + 60 * i);
    // }
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    switch (optionIndex) {
        case 0:
            ctx.moveTo(490, 620);
            ctx.lineTo(490, 640);
            ctx.lineTo(510, 630);
            ctx.lineTo(490, 620);
            break;
        case 1:
            ctx.moveTo(490, 680);
            ctx.lineTo(490, 700);
            ctx.lineTo(510, 690);
            ctx.lineTo(490, 680);
            break;
        case 2:
            ctx.moveTo(820, 620);
            ctx.lineTo(820, 640);
            ctx.lineTo(840, 630);
            ctx.lineTo(820, 620);
            break;
    }
    ctx.fill();
}

export function drawShopItems(ctx, items, selectedItem = 0) {
    ctx.font = "20px Arial";
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.stroke();
    //fill the box with light gray

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //draw the items
    ctx.fillStyle = 'white';
    ctx.fillText("Items", 150, 35);
    ctx.fillText("Quantity", 340, 35);
    ctx.fillText("Description", 470, 35);
    //draw lines to separate items
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
        ctx.moveTo(110, 45);
        ctx.lineTo(1270, 45);
    ctx.stroke();
    //draw lines to separate columns
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
    ctx.moveTo(320, 10);
    ctx.lineTo(320, 590);
    ctx.moveTo(450, 10);
    ctx.lineTo(450, 590);
    ctx.stroke();

    //set font

    for (let i = 0; i < items.length; i++) {
        ctx.fillText(items[i].name, 150, 70 + 30 * i);
        ctx.fillText(items[i].quantity, 380, 70 + 30 * i);
        ctx.fillText(items[i].description, 470, 70 + 30 * i);
    }

    //draw arrow pointing to the right on the current item
    ctx.beginPath();
ctx.fillStyle = 'white';
ctx.lineWidth = 1;
ctx.moveTo(120 , 50 + 30 * selectedItem); // Punto inicial
ctx.lineTo(140 , 60 + 30 * selectedItem); // Punto superior derecho
ctx.lineTo(120 , 70 + 30 * selectedItem); // Punto inferior derecho
ctx.lineTo(120 , 50+ 30 * selectedItem); // Volver al punto inicial
ctx.fill();
}

export function drawCombatOptions(ctx, currentOption = 0) {
    //set font 
    ctx.font = "30px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Attack", 500, 640);
    ctx.fillText("Defend", 500, 700);
    ctx.fillText("Items", 850, 640);
    ctx.fillText("Run", 850, 700);

    //draw arrow on the current option
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
    switch (currentOption) {
        case 0:
            ctx.moveTo(470, 620);
            ctx.lineTo(470, 640);
            ctx.lineTo(490, 630);
            ctx.lineTo(470, 620);
            break;
        case 1:
            ctx.moveTo(470, 680);
            ctx.lineTo(470, 700);
            ctx.lineTo(490, 690);
            ctx.lineTo(470, 680);
            break;
        case 2:
            ctx.moveTo(820, 620);
            ctx.lineTo(820, 640);
            ctx.lineTo(840, 630);
            ctx.lineTo(820, 620);
            break;
        case 3:
            ctx.moveTo(820, 680);
            ctx.lineTo(820, 700);
            ctx.lineTo(840, 690);
            ctx.lineTo(820, 680);
            break;
    }
    // ctx.moveTo(465, 680 + 60 * currentOption);

    ctx.fill();
}
