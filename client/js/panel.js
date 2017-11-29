class Panel extends Phaser.Graphics {

    constructor(width, height) {

        super(game, 0, 0);

        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(0, 0, 100, 100);
        this.endFill();

        this.w = width;
        this.h = height;
        this.subs = [];

        this.fixedToCamera = true;

        game.add.existing(this);
    }

    add(item) {

        this.subs.push(item);
        item.parent = this;

    }

    update() {

        this.clear();
        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width / 2 - this.w / 2, game.height / 4 - this.h / 2, this.w, this.h);
        this.endFill();

        this.subs.forEach(function (item) {

            item.update();

        })

    }

}
class SelectList {

    constructor(width, height, items, event, key) {

        this.w = width;
        this.h = height;

        this.text = document.createElement("select");
        this.text.id = "files";
        this.text.style.position = 'absolute';
        document.getElementById("game").appendChild(this.text);

        for (var i = 0; i < items.length; i++) {

            let option = document.createElement("option");
            option.value = items[i];
            option.text = items[i];
            this.text.appendChild(option);

        }

        this.text.style.width = this.w * 3 / 4 + 'px';
        this.text.style.top = game.height / 4 - this.h / 6 + 'px';
        this.text.style.left = game.width / 2 - this.w * 3 / 8 + 'px';

        let elem = this;

        game.input.keyboard.onDownCallback = function (e) {

            if (e.key === key) {

                event(elem);
                elem.text.parentNode.removeChild(elem.text);
                elem.parent.destroy();

            }

        }

    }

    update() {

        this.text.style.width = this.w * 3 / 4 + 'px';
        this.text.style.top = game.height / 4 - this.h / 6 + 'px';
        this.text.style.left = game.width / 2 - this.w * 3 / 8 + 'px';

    }

}
class TextBox {

    constructor(width, height, event, key) {

        this.w = width;
        this.h = height;

        this.text = document.createElement("input");
        this.text.id = "file";
        this.text.style.position = 'absolute';
        document.getElementById("game").appendChild(this.text);

        this.text.style.width = this.w * 3 / 4 + 'px';
        this.text.style.top = game.height / 4 - this.h / 6 + 'px';
        this.text.style.left = game.width / 2 - this.w * 3 / 8 + 'px';

        let elem = this;

        game.input.keyboard.onDownCallback = function (e) {

            if (e.key === key) {

                event(elem);
                elem.text.parentNode.removeChild(elem.text);
                elem.parent.destroy();

            }

        }

    }

    update() {

        this.text.style.width = this.w * 3 / 4 + 'px';
        this.text.style.top = game.height / 4 - this.h / 6 + 'px';
        this.text.style.left = game.width / 2 - this.w * 3 / 8 + 'px';

    }

}