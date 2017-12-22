class InputField extends Phaser.Graphics {

    constructor(id, pos, type) {

        super(game, 0, 0);

        this.pos = pos;

        this.elem = document.createElement("INPUT");
        this.elem.setAttribute('id', id);
        this.elem.style.position = 'absolute';

        switch (type) {

            case Number: this.elem.value = 0; break;

        }

        document.getElementById('game').appendChild(this.elem);

        game.add.existing(this);
    }

    get value() {

        return this.elem.value;

    }

    set value(value) {

        this.elem.value = value;

    }

    update() {

        this.elem.style.width = game.width / 8 + 'px';
        this.elem.style.top = game.height / 20 + game.height / 20 * this.pos + 'px';
        this.elem.style.left = game.width * 3 / 4 + game.width / 4 / 4 + 'px';

    }

}
class Button extends Phaser.Graphics {

    constructor(label, pos, fields, down) {

        super(game, 0, 0);

        this.pos = pos;
        this.fields = fields;

        let style = { font: "bold 22px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.label = game.add.text(0, 0, label, style);
        this.label.setTextBounds(game.width * 3 / 4 + game.width / 4 / 4,
            game.height / 20 + game.height / 20 * this.pos,
            game.width / 8,
            game.height / 20);

        this.inputEnabled = true;
        this.events.onInputDown.add(down, this);

        game.add.existing(this);
    }

    get value() {

        return this.elem.value;

    }

    set value(value) {

        this.elem.value = value;

    }

    update() {

        this.clear();

        this.beginFill(0x000000);
        this.lineStyle(1, 0xffffff, 1);

        this.drawRect(game.width * 3 / 4 + game.width / 4 / 4,
            game.height / 20 + game.height / 20 * this.pos,
            game.width / 8,
            game.height / 20)

        this.endFill();

        this.label.bringToTop();
        this.label.fontSize = game.width / 50;
        this.label.setTextBounds(game.width * 3 / 4 + game.width / 4 / 4,
            game.height / 20 + game.height / 20 * this.pos,
            game.width / 8,
            game.height / 20);

    }

}