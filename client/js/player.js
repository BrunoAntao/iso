class Player extends Phaser.Sprite {

    constructor(x, y, z) {

        super(game, 300 / 4 + x * 32 + y * 32 + global.point.x, 1200 / 4 - y * 16 + x * 16 - z * 32 + global.point.y, 'tile');

        this.anchor.setTo(0.5, 0.25);

        this.isoX = x;
        this.isoY = y;
        this.isoZ = z;

    }

    update() {

        this.x = 300 / 4 + this.isoX * 32 + this.isoY * 32 + global.point.x;
        this.y = 1200 / 4 - this.isoY * 16 + this.isoX * 16 - this.isoZ * 32 + global.point.y;

    }

}