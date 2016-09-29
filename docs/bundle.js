(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const global_1 = require("./global");
class Bullet extends global_1.Body {
    constructor(center, velocity) {
        super();
        this.size = { x: 3, y: 3 };
        this.center = center;
        this.velocity = velocity;
    }
    update() {
        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
    }
}
exports.Bullet = Bullet;

},{"./global":3}],2:[function(require,module,exports){
"use strict";
const util_1 = require("./util");
const player_1 = require("./player");
const invader_1 = require("./invader");
const keys_1 = require("./keys");
class Game {
    constructor(domId) {
        this.canvas = document.getElementById(domId);
        this.canvas.onclick = this.reset.bind(this);
        this.gameSize = { x: this.canvas.width, y: this.canvas.height };
        this.screen = this.canvas.getContext("2d");
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === keys_1.KEYS.R) {
                this.reset();
            }
        });
    }
    addBody(body) {
        this.bodies.push(body);
    }
    tick() {
        if (!this.hasPlayer()) {
            this.loseGame();
            return;
        }
        if (!this.hasInvaders()) {
            this.winGame();
            return;
        }
        this.update();
        this.draw();
        requestAnimationFrame(this.tick.bind(this));
    }
    invadersBelow(invader) {
        return this.bodies.filter((body) => {
            return body instanceof invader_1.Invader &&
                body.center.y > invader.center.y &&
                body.center.x - invader.center.x < invader.size.x;
        });
    }
    start() {
        this.reset();
    }
    reset() {
        this.bodies = util_1.Util.produceInvaders(this);
        this.bodies.push(new player_1.Player(this));
        this.tick();
    }
    draw() {
        this.screen.clearRect(0, 0, this.gameSize.x, this.gameSize.y);
        for (let i = 0; i < this.bodies.length; i++) {
            util_1.Util.drawRect(this.screen, this.bodies[i]);
        }
    }
    update() {
        let bodies = this.bodies;
        const notCollidingWithAnything = (b1) => {
            return bodies.filter((b2) => {
                return util_1.Util.colliding(b1, b2);
            }).length === 0;
        };
        this.bodies = this.bodies.filter(notCollidingWithAnything);
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
        }
    }
    hasPlayer() {
        return this.bodies.filter((body) => {
            return body instanceof player_1.Player;
        }).length === 1;
    }
    hasInvaders() {
        return this.bodies.filter((body) => {
            return body instanceof invader_1.Invader;
        }).length > 0;
    }
    loseGame() {
        this.displayMessage("Game Over");
    }
    winGame() {
        this.displayMessage("You Win!");
    }
    displayMessage(text) {
        this.screen.font = "48px serif";
        this.screen.textAlign = "center";
        this.screen.fillText(text, this.gameSize.x / 2, this.gameSize.y / 2);
    }
}
exports.Game = Game;

},{"./invader":4,"./keys":6,"./player":8,"./util":9}],3:[function(require,module,exports){
"use strict";
class Velocity {
}
exports.Velocity = Velocity;
class Size {
}
exports.Size = Size;
class Center {
}
exports.Center = Center;
class Body {
}
exports.Body = Body;

},{}],4:[function(require,module,exports){
"use strict";
const bullet_1 = require("./bullet");
const global_1 = require("./global");
class Invader extends global_1.Body {
    constructor(game, center) {
        super();
        this.size = { x: 15, y: 15 };
        this.bulletChance = 0.99;
        this.game = game;
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    }
    update() {
        if (this.patrolX < 0 || this.patrolX > 40) {
            this.speedX = -this.speedX;
        }
        this.center.x += this.speedX;
        this.patrolX += this.speedX;
        if (Math.random() > this.bulletChance && !this.game.invadersBelow(this).length) {
            let bullet = new bullet_1.Bullet({ x: this.center.x, y: this.center.y + this.size.x / 2 }, { x: Math.random() - 0.5, y: 2 });
            this.game.addBody(bullet);
        }
    }
}
exports.Invader = Invader;

},{"./bullet":1,"./global":3}],5:[function(require,module,exports){
"use strict";
class Keyboarder {
    constructor() {
        this.keyState = [];
        window.addEventListener("keydown", (event) => {
            this.keyState[event.keyCode] = true;
        });
        window.addEventListener("keyup", (event) => {
            this.keyState[event.keyCode] = false;
        });
    }
    isDown(keyCode) {
        return this.keyState[keyCode] === true;
    }
}
exports.Keyboarder = Keyboarder;

},{}],6:[function(require,module,exports){
"use strict";
exports.KEYS = {
    LEFT: 37,
    R: 82,
    RIGHT: 39,
    SPACE: 32,
};

},{}],7:[function(require,module,exports){
"use strict";
const game_1 = require("./game");
window.onload = function () {
    const game = new game_1.Game("screen");
    game.start();
};

},{"./game":2}],8:[function(require,module,exports){
"use strict";
const bullet_1 = require("./bullet");
const keyboarder_1 = require("./keyboarder");
const keys_1 = require("./keys");
const global_1 = require("./global");
class Player extends global_1.Body {
    constructor(game) {
        super();
        this.size = { x: 15, y: 15 };
        this.game = game;
        this.keyboarder = new keyboarder_1.Keyboarder();
        this.center = { x: this.game.gameSize.x / 2, y: this.game.gameSize.y - this.size.x };
    }
    update() {
        if (this.keyboarder.isDown(keys_1.KEYS.LEFT) && this.center.x - this.size.x / 2 > 0) {
            this.center.x -= 2;
        }
        else if (this.keyboarder.isDown(keys_1.KEYS.RIGHT) && this.center.x + this.size.x / 2 < this.game.gameSize.x) {
            this.center.x += 2;
        }
        if (this.keyboarder.isDown(keys_1.KEYS.SPACE)) {
            let bullet = new bullet_1.Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2 }, { x: 0, y: -6 });
            this.game.addBody(bullet);
        }
    }
}
exports.Player = Player;

},{"./bullet":1,"./global":3,"./keyboarder":5,"./keys":6}],9:[function(require,module,exports){
"use strict";
const invader_1 = require("./invader");
class Util {
    static produceInvaders(game) {
        let invaders = [];
        for (let i = 0; i < 24; i++) {
            let x = 30 + (i % 8) * 30;
            let y = 30 + (i % 3) * 30;
            invaders.push(new invader_1.Invader(game, { x: x, y: y }));
        }
        return invaders;
    }
    static colliding(b1, b2) {
        return !(b1 === b2 ||
            b1.center.x + b1.size.x / 2 < b2.center.x + b2.size.x / 2 ||
            b1.center.y + b1.size.y / 2 < b2.center.y + b2.size.y / 2 ||
            b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
            b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    }
    static drawRect(screen, body) {
        screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
    }
}
exports.Util = Util;

},{"./invader":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnVsbGV0LnRzIiwic3JjL2dhbWUudHMiLCJzcmMvZ2xvYmFsLnRzIiwic3JjL2ludmFkZXIudHMiLCJzcmMva2V5Ym9hcmRlci50cyIsInNyYy9rZXlzLnRzIiwic3JjL21haW4udHMiLCJzcmMvcGxheWVyLnRzIiwic3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUEseUJBQXFCLFVBQVUsQ0FBQyxDQUFBO0FBRWhDLHFCQUE0QixhQUFJO0lBSTVCLFlBQVksTUFBYyxFQUFFLFFBQWtCO1FBQzFDLE9BQU8sQ0FBQztRQUpMLFNBQUksR0FBUyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO1FBSzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFTSxNQUFNO1FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQztBQUNMLENBQUM7QUFkWSxjQUFNLFNBY2xCLENBQUE7Ozs7QUNoQkQsdUJBQXFCLFFBQVEsQ0FBQyxDQUFBO0FBQzlCLHlCQUF1QixVQUFVLENBQUMsQ0FBQTtBQUNsQywwQkFBd0IsV0FBVyxDQUFDLENBQUE7QUFDcEMsdUJBQXFCLFFBQVEsQ0FBQyxDQUFBO0FBRTlCO0lBTUksWUFBWSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQXVCLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtB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TUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUN6RCxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUM1RCxDQUFDO0lBQ04sQ0FBQztJQUVELE9BQWMsUUFBUSxDQUFDLE1BQWdDLEVBQUUsSUFBVTtRQUMvRCxNQUFNLENBQUMsUUFBUSxDQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDZCxDQUFDO0lBQ04sQ0FBQztBQUNMLENBQUM7QUEvQlksWUFBSSxPQStCaEIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBCb2R5IH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5cbmV4cG9ydCBjbGFzcyBCdWxsZXQgZXh0ZW5kcyBCb2R5IHtcbiAgICBwdWJsaWMgc2l6ZTogU2l6ZSA9IHt4OiAzLCB5OiAzfTtcbiAgICBwcm90ZWN0ZWQgdmVsb2NpdHk6IFZlbG9jaXR5O1xuXG4gICAgY29uc3RydWN0b3IoY2VudGVyOiBDZW50ZXIsIHZlbG9jaXR5OiBWZWxvY2l0eSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuY2VudGVyLnggKz0gdGhpcy52ZWxvY2l0eS54O1xuICAgICAgICB0aGlzLmNlbnRlci55ICs9IHRoaXMudmVsb2NpdHkueTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBVdGlsIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBJbnZhZGVyIH0gZnJvbSBcIi4vaW52YWRlclwiO1xuaW1wb3J0IHsgS0VZUyB9IGZyb20gXCIuL2tleXNcIjtcblxuZXhwb3J0IGNsYXNzIEdhbWUge1xuICAgIHB1YmxpYyBnYW1lU2l6ZTogU2l6ZTtcbiAgICBwcm90ZWN0ZWQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwcm90ZWN0ZWQgYm9kaWVzOiBCb2R5W107XG4gICAgcHJvdGVjdGVkIHNjcmVlbjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3RydWN0b3IoZG9tSWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSWQpO1xuICAgICAgICB0aGlzLmNhbnZhcy5vbmNsaWNrID0gdGhpcy5yZXNldC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWVTaXplID0ge3g6IHRoaXMuY2FudmFzLndpZHRoLCB5OiB0aGlzLmNhbnZhcy5oZWlnaHR9O1xuICAgICAgICB0aGlzLnNjcmVlbiA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlTLlIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRCb2R5KGJvZHk6IEJvZHkpIHtcbiAgICAgICAgdGhpcy5ib2RpZXMucHVzaChib2R5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGljaygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc1BsYXllcigpKSB7XG4gICAgICAgICAgICB0aGlzLmxvc2VHYW1lKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmhhc0ludmFkZXJzKCkpIHtcbiAgICAgICAgICAgIHRoaXMud2luR2FtZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGludmFkZXJzQmVsb3coaW52YWRlcjogSW52YWRlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2RpZXMuZmlsdGVyKChib2R5OiBCb2R5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYm9keSBpbnN0YW5jZW9mIEludmFkZXIgJiZcbiAgICAgICAgICAgICAgICBib2R5LmNlbnRlci55ID4gaW52YWRlci5jZW50ZXIueSAmJlxuICAgICAgICAgICAgICAgIGJvZHkuY2VudGVyLnggLSBpbnZhZGVyLmNlbnRlci54IDwgaW52YWRlci5zaXplLng7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0KCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlc2V0KCkge1xuICAgICAgICB0aGlzLmJvZGllcyA9IFV0aWwucHJvZHVjZUludmFkZXJzKHRoaXMpO1xuICAgICAgICB0aGlzLmJvZGllcy5wdXNoKG5ldyBQbGF5ZXIodGhpcykpO1xuICAgICAgICB0aGlzLnRpY2soKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZHJhdygpIHtcbiAgICAgICAgdGhpcy5zY3JlZW4uY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ2FtZVNpemUueCwgdGhpcy5nYW1lU2l6ZS55KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgVXRpbC5kcmF3UmVjdCh0aGlzLnNjcmVlbiwgdGhpcy5ib2RpZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZSgpIHtcbiAgICAgICAgbGV0IGJvZGllcyA9IHRoaXMuYm9kaWVzO1xuICAgICAgICBjb25zdCBub3RDb2xsaWRpbmdXaXRoQW55dGhpbmcgPSAoYjE6IEJvZHkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBib2RpZXMuZmlsdGVyKChiMjogQm9keSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBVdGlsLmNvbGxpZGluZyhiMSwgYjIpO1xuICAgICAgICAgICAgfSkubGVuZ3RoID09PSAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYm9kaWVzID0gdGhpcy5ib2RpZXMuZmlsdGVyKG5vdENvbGxpZGluZ1dpdGhBbnl0aGluZyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGhhc1BsYXllcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9kaWVzLmZpbHRlcigoYm9keTogQm9keSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGJvZHkgaW5zdGFuY2VvZiBQbGF5ZXI7XG4gICAgICAgIH0pLmxlbmd0aCA9PT0gMTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaGFzSW52YWRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJvZGllcy5maWx0ZXIoKGJvZHk6IEJvZHkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBib2R5IGluc3RhbmNlb2YgSW52YWRlcjtcbiAgICAgICAgfSkubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbG9zZUdhbWUoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoXCJHYW1lIE92ZXJcIik7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHdpbkdhbWUoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoXCJZb3UgV2luIVwiKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZGlzcGxheU1lc3NhZ2UodGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2NyZWVuLmZvbnQgPSBcIjQ4cHggc2VyaWZcIjtcbiAgICAgICAgdGhpcy5zY3JlZW4udGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGhpcy5zY3JlZW4uZmlsbFRleHQodGV4dCwgdGhpcy5nYW1lU2l6ZS54IC8gMiwgdGhpcy5nYW1lU2l6ZS55IC8gMik7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZlbG9jaXR5IHtcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xuICAgIHB1YmxpYyB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTaXplIHtcbiAgICBwdWJsaWMgeDogbnVtYmVyO1xuICAgIHB1YmxpYyB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDZW50ZXIge1xuICAgIHB1YmxpYyB4OiBudW1iZXI7XG4gICAgcHVibGljIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJvZHkge1xuICAgIHB1YmxpYyBjZW50ZXI6IENlbnRlcjtcbiAgICBwdWJsaWMgc2l6ZTogU2l6ZTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCB1cGRhdGUoKTogdm9pZDtcbn1cbiIsImltcG9ydCB7IEJ1bGxldCB9IGZyb20gXCIuL2J1bGxldFwiO1xuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCB7IEJvZHkgfSBmcm9tIFwiLi9nbG9iYWxcIjtcblxuZXhwb3J0IGNsYXNzIEludmFkZXIgZXh0ZW5kcyBCb2R5IHtcbiAgICBwdWJsaWMgc2l6ZTogU2l6ZSA9IHt4OiAxNSwgeTogMTV9O1xuICAgIHByb3RlY3RlZCBnYW1lOiBHYW1lO1xuICAgIHByb3RlY3RlZCBwYXRyb2xYOiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIHNwZWVkWDogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBidWxsZXRDaGFuY2U6IG51bWJlciA9IDAuOTk7XG5cbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lLCBjZW50ZXI6IENlbnRlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICAgICAgdGhpcy5wYXRyb2xYID0gMDtcbiAgICAgICAgdGhpcy5zcGVlZFggPSAwLjM7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhdHJvbFggPCAwIHx8IHRoaXMucGF0cm9sWCA+IDQwKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVkWCA9IC10aGlzLnNwZWVkWDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNlbnRlci54ICs9IHRoaXMuc3BlZWRYO1xuICAgICAgICB0aGlzLnBhdHJvbFggKz0gdGhpcy5zcGVlZFg7XG5cbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiB0aGlzLmJ1bGxldENoYW5jZSAmJiAhdGhpcy5nYW1lLmludmFkZXJzQmVsb3codGhpcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgYnVsbGV0ID0gbmV3IEJ1bGxldChcbiAgICAgICAgICAgICAgICB7IHg6IHRoaXMuY2VudGVyLngsIHk6IHRoaXMuY2VudGVyLnkgKyB0aGlzLnNpemUueCAvIDIgfSxcbiAgICAgICAgICAgICAgICB7IHg6IE1hdGgucmFuZG9tKCkgLSAwLjUsIHk6IDIgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGRCb2R5KGJ1bGxldCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJleHBvcnQgY2xhc3MgS2V5Ym9hcmRlciB7XG4gICAgcHJvdGVjdGVkIGtleVN0YXRlOiBCb29sZWFuW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleVN0YXRlW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5U3RhdGVbZXZlbnQua2V5Q29kZV0gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzRG93bihrZXlDb2RlOiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5U3RhdGVba2V5Q29kZV0gPT09IHRydWU7XG4gICAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IEtFWVMgPSB7XG4gICAgTEVGVDogMzcsXG4gICAgUjogODIsXG4gICAgUklHSFQ6IDM5LFxuICAgIFNQQUNFOiAzMixcbn07XG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGdhbWUgPSBuZXcgR2FtZShcInNjcmVlblwiKTtcbiAgICBnYW1lLnN0YXJ0KCk7XG59O1xuIiwiaW1wb3J0IHsgQnVsbGV0IH0gZnJvbSBcIi4vYnVsbGV0XCI7XG5pbXBvcnQgeyBLZXlib2FyZGVyIH0gZnJvbSBcIi4va2V5Ym9hcmRlclwiO1xuaW1wb3J0IHsgS0VZUyB9IGZyb20gXCIuL2tleXNcIjtcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgeyBCb2R5IH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5cbmV4cG9ydCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBCb2R5IHtcbiAgICBwdWJsaWMgc2l6ZTogU2l6ZSA9IHt4OiAxNSwgeTogMTV9O1xuICAgIHByb3RlY3RlZCBrZXlib2FyZGVyOiBLZXlib2FyZGVyO1xuICAgIHByb3RlY3RlZCBnYW1lOiBHYW1lO1xuXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleWJvYXJkZXIgPSBuZXcgS2V5Ym9hcmRlcigpO1xuICAgICAgICB0aGlzLmNlbnRlciA9IHt4OiB0aGlzLmdhbWUuZ2FtZVNpemUueCAvIDIsIHk6IHRoaXMuZ2FtZS5nYW1lU2l6ZS55IC0gdGhpcy5zaXplLnh9O1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmtleWJvYXJkZXIuaXNEb3duKEtFWVMuTEVGVCkgJiYgdGhpcy5jZW50ZXIueCAtIHRoaXMuc2l6ZS54IC8gMiA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY2VudGVyLnggLT0gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmtleWJvYXJkZXIuaXNEb3duKEtFWVMuUklHSFQpICYmIHRoaXMuY2VudGVyLnggKyB0aGlzLnNpemUueCAvIDIgPCB0aGlzLmdhbWUuZ2FtZVNpemUueCkge1xuICAgICAgICAgICAgdGhpcy5jZW50ZXIueCArPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmRlci5pc0Rvd24oS0VZUy5TUEFDRSkpIHtcbiAgICAgICAgICAgIGxldCBidWxsZXQgPSBuZXcgQnVsbGV0KFxuICAgICAgICAgICAgICAgIHsgeDogdGhpcy5jZW50ZXIueCwgeTogdGhpcy5jZW50ZXIueSAtIHRoaXMuc2l6ZS54IC8gMiB9LFxuICAgICAgICAgICAgICAgIHsgeDogMCwgeTogLTYgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGRCb2R5KGJ1bGxldCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnZhZGVyIH0gZnJvbSBcIi4vaW52YWRlclwiO1xuXG5leHBvcnQgY2xhc3MgVXRpbCB7XG4gICAgcHVibGljIHN0YXRpYyBwcm9kdWNlSW52YWRlcnMoZ2FtZTogYW55KSB7XG4gICAgICAgIGxldCBpbnZhZGVyczogSW52YWRlcltdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgeCA9IDMwICsgKGkgJSA4KSAqIDMwO1xuICAgICAgICAgICAgbGV0IHkgPSAzMCArIChpICUgMykgKiAzMDtcbiAgICAgICAgICAgIGludmFkZXJzLnB1c2gobmV3IEludmFkZXIoZ2FtZSwge3g6IHgsIHk6IHl9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW52YWRlcnM7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjb2xsaWRpbmcoYjE6IEJvZHksIGIyOiBCb2R5KSB7XG4gICAgICAgIHJldHVybiAhKFxuICAgICAgICAgICAgYjEgPT09IGIyIHx8XG4gICAgICAgICAgICBiMS5jZW50ZXIueCArIGIxLnNpemUueCAvIDIgPCBiMi5jZW50ZXIueCArIGIyLnNpemUueCAvIDIgfHxcbiAgICAgICAgICAgIGIxLmNlbnRlci55ICsgYjEuc2l6ZS55IC8gMiA8IGIyLmNlbnRlci55ICsgYjIuc2l6ZS55IC8gMiB8fFxuICAgICAgICAgICAgYjEuY2VudGVyLnggLSBiMS5zaXplLnggLyAyID4gYjIuY2VudGVyLnggKyBiMi5zaXplLnggLyAyIHx8XG4gICAgICAgICAgICBiMS5jZW50ZXIueSAtIGIxLnNpemUueSAvIDIgPiBiMi5jZW50ZXIueSArIGIyLnNpemUueSAvIDJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGRyYXdSZWN0KHNjcmVlbjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBib2R5OiBCb2R5KSB7XG4gICAgICAgIHNjcmVlbi5maWxsUmVjdChcbiAgICAgICAgICAgIGJvZHkuY2VudGVyLnggLSBib2R5LnNpemUueCAvIDIsXG4gICAgICAgICAgICBib2R5LmNlbnRlci55IC0gYm9keS5zaXplLnkgLyAyLFxuICAgICAgICAgICAgYm9keS5zaXplLngsXG4gICAgICAgICAgICBib2R5LnNpemUueVxuICAgICAgICApO1xuICAgIH1cbn1cbiJdfQ==
