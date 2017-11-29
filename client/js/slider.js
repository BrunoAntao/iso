class Slider extends Phaser.Graphics {

    constructor(x, y, width, height) {

        super(game, 0, 0);
        
        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(x, y, game.width/this.resX, game.height/this.resY);
        this.endFill();

        this.fixedToCamera = true;
        this.posX = x;
        this.posY = y;
        this.resX = width;
        this.resY = height;

        game.add.existing(this);
    }

    update() {

        this.clear();
        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width/this.posX + game.width/this.resX, this.posY, game.width/this.resX, game.height/this.resY);
        this.endFill();

    }

}
class Item extends Phaser.Sprite{

    constructor(id) {

        super(game, 0, 0, 'tile');

    }

}