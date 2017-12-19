class Pallete extends Phaser.Graphics {

    constructor() {

        super(game, 0, 0);

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

        this.red = document.createElement("INPUT");
        this.red.setAttribute('type', 'range');
        this.red.setAttribute('id', 'red');
        this.red.setAttribute('min', 0);
        this.red.setAttribute('max', 255);
        this.red.setAttribute('step', 1);
        this.red.setAttribute('value', 0);
        this.red.style.position = 'absolute';

        document.getElementById("game").appendChild(this.red);

        this.green = document.createElement("INPUT");
        this.green.setAttribute('type', 'range');
        this.green.setAttribute('id', 'green');
        this.green.setAttribute('min', 0);
        this.green.setAttribute('max', 255);
        this.green.setAttribute('step', 1);
        this.green.setAttribute('value', 0);
        this.green.style.position = 'absolute';

        document.getElementById("game").appendChild(this.green);

        this.blue = document.createElement("INPUT");
        this.blue.setAttribute('type', 'range');
        this.blue.setAttribute('id', 'blue');
        this.blue.setAttribute('min', 0);
        this.blue.setAttribute('max', 255);
        this.blue.setAttribute('step', 1);
        this.blue.setAttribute('value', 0);
        this.blue.style.position = 'absolute';

        document.getElementById("game").appendChild(this.blue);

        this.color = document.createElement("INPUT");
        this.color.setAttribute('id', 'color');
        this.color.style.position = 'absolute';

        document.getElementById("game").appendChild(this.color);

        game.add.existing(this);
    }

    update() {

        this.red.style.width = game.width / 8 + 'px';
        this.red.style.top = game.height * 3 / 4 + 'px';
        this.red.style.left = game.width * 3 / 4 + game.width / 16 + 'px';
        this.green.style.width = game.width / 8 + 'px';
        this.green.style.top = game.height * 3 / 4 + game.height / 32 + 'px';
        this.green.style.left = game.width * 3 / 4 + game.width / 16 + 'px';
        this.blue.style.width = game.width / 8 + 'px';
        this.blue.style.top = game.height * 3 / 4 + game.height / 16 + 'px';
        this.blue.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

        this.color.value = this.rgb(this.red.value, this.green.value, this.blue.value);

        this.clear();

        this.beginFill(this.color.value, 1);
        this.lineStyle(1, 0xffffff, 1);

        this.drawCircle(game.width * 3 / 4 + game.width / 8, game.height * 3 / 4 - game.width / 8, game.width / 8);

        this.color.style.width = game.width / 8 + 'px';
        this.color.style.top = game.height * 3 / 4 - game.width / 32 + 'px';
        this.color.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

    }

}