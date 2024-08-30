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

export function drawItemsBox(ctx, items) {
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

export function drawCombatOptions(ctx, currentOption = 0) {
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