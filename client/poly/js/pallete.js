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

        let pallete = this;

        this.color = new Text(this, 'game', 'color', this.pos, function () {

            let color = pallete.hexToRgb(this.elem.value);
            pallete.red.value = color.r;
            pallete.green.value = color.g;
            pallete.blue.value = color.b;
            this.elem.blur();

        });
        this.red = new Range(this, 'game', 'red', this.pos + 1, 0, 255, 1, 0, function () {

            pallete.saveColor(
                pallete.rgb(
                    pallete.red.value,
                    pallete.green.value,
                    pallete.blue.value));

        });
        this.blue = new Range(this, 'game', 'blue', this.pos + 2, 0, 255, 1, 0, function () {

            pallete.saveColor(
                pallete.rgb(
                    pallete.red.value,
                    pallete.green.value,
                    pallete.blue.value));

        });
        this.green = new Range(this, 'game', 'green', this.pos + 3, 0, 255, 1, 0, function () {

            pallete.saveColor(
                pallete.rgb(
                    pallete.red.value,
                    pallete.green.value,
                    pallete.blue.value));

        });

        this.cHistory = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000];
        this.cSlots = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000];
        this.cDisplays = game.add.group();
        this.cSDisplays = game.add.group();

        for (let i = 0; i < 5; i++) {

            this.cDisplays.add(new cDisplay(this, i));
            this.cSDisplays.add(new cSlot(this, i));

        }

        game.add.existing(this);
    }

    queue(color) {

        this.cHistory.push(color);
        this.cHistory.shift();

    }

    saveColor() {

        this.queue(this.color.value);
        this.cDisplays.forEach(function (display) {

            display.setColor(this.cHistory[this.cDisplays.getIndex(display)]);

        }, this);

    }

    update() {

        if (!this.color.selected) {

            this.color.value = this.rgb(this.red.value, this.green.value, this.blue.value);
            this.selected = this.color.value;

        }

        this.clear();

        this.beginFill(this.color.value, 1);
        this.lineStyle(1, 0xffffff, 1);

        this.drawCircle(game.width * 3 / 4 + game.width / 8, game.height / 4 / 6 * (this.pos) + game.width / 10 / 2 * 1 + game.width / 10 / 10, game.width / 10);

        this.endFill();

    }

}
class Range extends Phaser.Graphics {

    constructor(pallete, parent, id, pos, min, max, step, value, up) {

        super(game, 0, 0);

        this.pos = pos;
        this.pallete = pallete;

        this.elem = document.createElement("INPUT");
        this.elem.setAttribute('type', 'range');
        this.elem.setAttribute('id', id);
        this.elem.setAttribute('min', min);
        this.elem.setAttribute('max', max);
        this.elem.setAttribute('step', step);
        this.elem.setAttribute('value', value);
        this.elem.style.position = 'absolute';

        let elem = this;

        this.elem.addEventListener('mouseup', up);

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
        this.elem.style.top = game.height / 4 / 6 + game.width / 10 / 2 * 2 + game.height / 4 / 6 * this.pos + 'px';
        this.elem.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

    }

}
class Text extends Phaser.Graphics {

    constructor(pallete, parent, id, pos, submit) {

        super(game, 0, 0);

        this.pos = pos;
        this.pallete = pallete;
        this.selected = false;
        this.submit = submit;

        this.elem = document.createElement("INPUT");
        this.elem.setAttribute('id', id);
        this.elem.style.position = 'absolute';
        let elem = this;
        this.elem.onfocus = function (e) {

            elem.selected = true;

        }
        this.elem.onblur = function (e) {

            elem.selected = false;

        }
        this.elem.addEventListener('keydown', function (e) {

            if (e.key == 'Enter') {

                elem.submit();

            }

        })

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
        this.elem.style.top = game.height / 4 / 6 + game.width / 10 + game.height / 4 / 6 * this.pos + 'px';
        this.elem.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

    }

}
class cDisplay extends Phaser.Graphics {

    constructor(parent, id) {

        super(game, 0, 0);

        this.id = id;
        this.color = 0x000000;
        this.pallete = parent;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (display) {

            if (game.input.activePointer.leftButton.isDown) {

                let color = display.pallete.hexToRgb(display.color);
                display.pallete.red.value = color.r;
                display.pallete.green.value = color.g;
                display.pallete.blue.value = color.b;

            }

        }, this)

        game.add.existing(this);
    }

    setColor(color) {

        this.color = color;

    }

    update() {

        this.clear();

        this.beginFill(this.color, 1);
        this.lineStyle(1, 0xffffff, 1);

        this.drawRect(game.width * 3 / 4 + game.width / 4 / 20,
            game.height / 2 + game.width / 10 / 10 + game.width / 10 + game.height / 4 / 8 + this.id * game.width / 8 / 6,
            game.width / 8 / 6,
            game.width / 8 / 6);

        this.endFill();

    }

}
class cSlot extends Phaser.Graphics {

    constructor(parent, id) {

        super(game, 0, 0);

        this.id = id;
        this.color = 0x000000;
        this.pallete = parent;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (display) {

            if (game.input.activePointer.leftButton.isDown) {

                let color = display.pallete.hexToRgb(display.color);
                display.pallete.red.value = color.r;
                display.pallete.green.value = color.g;
                display.pallete.blue.value = color.b;

            } else {

                display.color = display.pallete.rgb(display.pallete.red.value, display.pallete.green.value, display.pallete.blue.value);

            }

        }, this)

        game.add.existing(this);
    }

    update() {

        this.clear();

        this.beginFill(this.color, 1);
        this.lineStyle(1, 0xffffff, 1);

        this.drawRect(game.width * 3 / 4 + game.width / 4 / 20 + game.width / 8 / 6,
            game.height / 2 + game.width / 10 / 10 + game.width / 10 + game.height / 4 / 8 + this.id * game.width / 8 / 6,
            game.width / 8 / 6,
            game.width / 8 / 6);

        this.endFill();

    }

}