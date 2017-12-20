class Pallete extends Phaser.Graphics {

    constructor(pos) {

        super(game, 0, 0);

        this.pos = pos;

        this.cHex = function (c) {
            let hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        this.rgb = function (r, g, b) {

            r = parseInt(r);
            g = parseInt(g);
            b = parseInt(b);

            return "0x" + this.cHex(r) + this.cHex(g) + this.cHex(b);
        }

        this.hexToRgb = function (hex) {

            var arrBuff = new ArrayBuffer(4);
            var vw = new DataView(arrBuff);
            vw.setUint32(0, parseInt(hex, 16), false);
            var arrByte = new Uint8Array(arrBuff);

            return { r: arrByte[1], g: arrByte[2], b: arrByte[3] };
        }

        this.color = new Text('game', 'color', this.pos + 6);
        this.red = new Range('game', 'red', this.pos + 7, 0, 255, 1, 0);
        this.blue = new Range('game', 'blue', this.pos + 8, 0, 255, 1, 0);
        this.green = new Range('game', 'green', this.pos + 9, 0, 255, 1, 0);

        game.add.existing(this);
    }

    update() {

        this.color.value = this.rgb(this.red.value, this.green.value, this.blue.value);

        this.clear();

        this.beginFill(this.color.value, 1);
        this.lineStyle(1, 0xffffff, 1);

        this.drawCircle(game.width * 3 / 4 + game.width / 8, game.height / 4 / 6 * (this.pos + 3), game.width / 8);

        this.selected = this.color.value;

    }

}

class Range extends Phaser.Graphics {

    constructor(parent, id, pos, min, max, step, value) {

        super(game, 0, 0);

        this.pos = pos;

        this.elem = document.createElement("INPUT");
        this.elem.setAttribute('type', 'range');
        this.elem.setAttribute('id', id);
        this.elem.setAttribute('min', min);
        this.elem.setAttribute('max', max);
        this.elem.setAttribute('step', step);
        this.elem.setAttribute('value', value);
        this.elem.style.position = 'absolute';

        document.getElementById(parent).appendChild(this.elem);

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
        this.elem.style.top = game.height / 4 / 6 * this.pos + 'px';
        this.elem.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

    }

}
class Text extends Phaser.Graphics {

    constructor(parent, id, pos) {

        super(game, 0, 0);

        this.pos = pos;

        this.elem = document.createElement("INPUT");
        this.elem.setAttribute('id', id);
        this.elem.style.position = 'absolute';

        document.getElementById(parent).appendChild(this.elem);

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
        this.elem.style.top = game.height / 4 / 6 * this.pos + 'px';
        this.elem.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

    }

}