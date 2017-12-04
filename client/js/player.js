class Player extends Phaser.Sprite {

    constructor(x, y, z) {

        super(game, 300 / 4 + x * 32 + y * 32 + global.point.x, 1200 / 4 - y * 16 + x * 16 - z * 32 + global.point.y, 'tile');

        this.anchor.setTo(0.5, 0.25);

        this.isoX = x;
        this.isoY = y;
        this.isoZ = z;

        this.ctrls = {

            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),

        }

    }

    update() {

        if (this.ctrls.up.isDown) {

            this.isoX -= 0.1;
            this.isoY += 0.1;

        }

        if (this.ctrls.down.isDown) {

            this.isoX += 0.1;
            this.isoY -= 0.1;

        }

        if (this.ctrls.left.isDown) {

            this.isoX -= 0.1;
            this.isoY -= 0.1;

        }

        if (this.ctrls.right.isDown) {

            this.isoX += 0.1;
            this.isoY += 0.1;

        }

        this.x = 300 / 4 + this.isoX * 32 + this.isoY * 32 + global.point.x;
        this.y = 1200 / 4 - this.isoY * 16 + this.isoX * 16 - this.isoZ * 32 + global.point.y;

    }

}