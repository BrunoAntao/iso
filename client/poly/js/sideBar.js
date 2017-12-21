class SideBar extends Phaser.Graphics{

    constructor(items) {

        super(game, 0, 0);

        this.items = game.add.group();

        items.forEach(function(item) {

            this.items.add(new Item());
            
        });

        game.add.existing(this);
    }

    draw() {

        this.clear();

        this.beginFill(0x000000);
        this.lineStyle(1, 0xffffff, 1);

        this.drawRect(game.width * 3 / 4, 0, game.width / 4, game.height);

        this.endFill();

    }

    update() {

        this.draw();

    }

}

class Item {

    constructor() {

        

    }

}