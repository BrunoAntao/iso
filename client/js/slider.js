class Slider extends Phaser.Graphics {

    constructor(items) {

        super(game, 0, 0);
        
        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width*3/4, 0, game.width/4, game.height);
        this.endFill();

        this.fixedToCamera = true;

        items.forEach(function(item) {

            new Item(item);

        })

        game.add.existing(this);
    }

    update() {

        this.clear();
        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width*3/4, 0, game.width/4, game.height);
        this.endFill();

    }

}
class Item extends Phaser.Sprite{

    constructor(id) {

        super(game, 0, 0, 'tile');

        this.anchor.setTo(0.5, 0.5);

        this.x = game.width*3/4 + game.width/8;
        this.y = 64 + id * 64;
        this.frame = id;

        game.add.existing(this);
    }

    update() {

        game.world.bringToTop(this);

        this.x = game.width*3/4 + game.width/8;

    }

}