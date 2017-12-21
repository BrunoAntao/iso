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

        this.color = new Text(this, 'game', 'color', this.pos + 1, function () {

            let color = pallete.hexToRgb(this.elem.value);
            pallete.red.value = color.r;
            pallete.green.value = color.g;
            pallete.blue.value = color.b;
            this.elem.blur();

        });
        this.red = new Range(this, 'game', 'red', this.pos + 2, 0, 255, 1, 0);
        this.blue = new Range(this, 'game', 'blue', this.pos + 3, 0, 255, 1, 0);
        this.green = new Range(this, 'game', 'green', this.pos + 4, 0, 255, 1, 0);

        this.cHistory = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000];
        this.cSlots = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000];
        this.cDisplays = [];

        for (let i = 0; i < 5; i++) {

            this.cDisplays.push(new cDisplay(this, i));
            new cSlot(this, i);

        }

        game.input.keyboard.addCallbacks(this, function (e) {

            if (e.key == 'c') {

                this.saveColor();

            }

        });

        //this.color.elem.

        game.add.existing(this);
    }

    queue(color) {

        this.cHistory.push(color);
        this.cHistory.shift();

    }

    saveColor() {

        this.queue(this.color.value);
        this.cDisplays.forEach(function (display, i) {

            display.setColor(this.cHistory[i]);

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

        this.drawCircle(game.width * 3 / 4 + game.width / 8, game.height / 4 / 6 * (this.pos) + game.width / 10 / 2 * 1.5, game.width / 10);

        this.endFill();

    }

}
class Range extends Phaser.Graphics {

    constructor(pallete, parent, id, pos, min, max, step, value) {

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

        this.elem.addEventListener('mouseup', function() {

            elem.pallete.saveColor(
                elem.pallete.rgb(
                    elem.pallete.red.value,
                    elem.pallete.green.value,
                    elem.pallete.blue.value));

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
        this.elem.style.top = game.height / 4 / 6 + game.width / 10 / 2 * 3.5 + game.height / 4 / 6 * this.pos + 'px';
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
        this.elem.style.top = game.height / 4 / 6 + game.width / 10 / 2 * 3.5 + game.height / 4 / 6 * this.pos + 'px';
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

        this.drawRect(game.width * 3 / 4 + (game.width / 4 - game.width / 8) / 2 + this.id * game.width / 8 / 5,
            game.height / 4 / 6 + game.width / 10 / 2 * 2.5 + game.height / 4 / 6 * this.pallete.pos,
            game.width / 8 / 5,
            game.width / 8 / 5);

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

        this.drawRect(game.width * 3 / 4 + (game.width / 4 - game.width / 8) / 2 + this.id * game.width / 8 / 5,
            game.height / 4 / 6 + game.width / 10 / 2 * 3.1 + game.height / 4 / 6 * this.pallete.pos,
            game.width / 8 / 5,
            game.width / 8 / 5);

        this.endFill();

    }

}