var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');

document.getElementById('game').style.position = 'relative';

window.addEventListener('resize', function () {

    game.scale.setGameSize(window.innerWidth, window.innerHeight);

})

var socket = io();
var global = {};

game.state.add('Game', gameState);

game.state.start('Game');