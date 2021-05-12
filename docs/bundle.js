(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
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
        window.addEventListener("keyup", event => {
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
            return (body instanceof invader_1.Invader &&
                body.center.y > invader.center.y &&
                body.center.x - invader.center.x < invader.size.x);
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
            return (bodies.filter((b2) => {
                return util_1.Util.colliding(b1, b2);
            }).length === 0);
        };
        this.bodies = this.bodies.filter(notCollidingWithAnything);
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
        }
    }
    hasPlayer() {
        return (this.bodies.filter((body) => {
            return body instanceof player_1.Player;
        }).length === 1);
    }
    hasInvaders() {
        return (this.bodies.filter((body) => {
            return body instanceof invader_1.Invader;
        }).length > 0);
    }
    loseGame() {
        this.displayMessage("Game Over");
    }
    winGame() {
        this.displayMessage("You win!");
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = exports.Center = exports.Size = exports.Velocity = void 0;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invader = void 0;
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
        if (Math.random() > this.bulletChance &&
            !this.game.invadersBelow(this).length) {
            let bullet = new bullet_1.Bullet({ x: this.center.x, y: this.center.y + this.size.x / 2 }, { x: Math.random() - 0.5, y: 2 });
            this.game.addBody(bullet);
        }
    }
}
exports.Invader = Invader;

},{"./bullet":1,"./global":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboarder = void 0;
class Keyboarder {
    constructor() {
        this.keyState = [];
        window.addEventListener("keydown", event => {
            this.keyState[event.keyCode] = true;
        });
        window.addEventListener("keyup", event => {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYS = void 0;
exports.KEYS = {
    LEFT: 37,
    R: 82,
    RIGHT: 39,
    SPACE: 32
};

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
window.onload = function () {
    const game = new game_1.Game("screen");
    game.start();
};

},{"./game":2}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const bullet_1 = require("./bullet");
const keyboarder_1 = require("./keyboarder");
const keys_1 = require("./keys");
const global_1 = require("./global");
class Player extends global_1.Body {
    constructor(game) {
        super();
        this.size = { x: 15, y: 15 };
        this.lastShot = 0;
        this.shotLag = 100;
        this.game = game;
        this.keyboarder = new keyboarder_1.Keyboarder();
        this.center = {
            x: this.game.gameSize.x / 2,
            y: this.game.gameSize.y - this.size.x
        };
    }
    update() {
        if (this.keyboarder.isDown(keys_1.KEYS.LEFT) &&
            this.center.x - this.size.x / 2 > 0) {
            this.center.x -= 2;
        }
        else if (this.keyboarder.isDown(keys_1.KEYS.RIGHT) &&
            this.center.x + this.size.x / 2 < this.game.gameSize.x) {
            this.center.x += 2;
        }
        if (this.keyboarder.isDown(keys_1.KEYS.SPACE)) {
            const now = new Date().getTime();
            if (now - this.lastShot < this.shotLag)
                return;
            this.lastShot = new Date().getTime();
            let bullet = new bullet_1.Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2 }, { x: 0, y: -6 });
            this.game.addBody(bullet);
        }
    }
}
exports.Player = Player;

},{"./bullet":1,"./global":3,"./keyboarder":5,"./keys":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnVsbGV0LnRzIiwic3JjL2dhbWUudHMiLCJzcmMvZ2xvYmFsLnRzIiwic3JjL2ludmFkZXIudHMiLCJzcmMva2V5Ym9hcmRlci50cyIsInNyYy9rZXlzLnRzIiwic3JjL21haW4udHMiLCJzcmMvcGxheWVyLnRzIiwic3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQSxxQ0FBd0Q7QUFFeEQsTUFBYSxNQUFPLFNBQVEsYUFBSTtJQUk5QixZQUFZLE1BQWMsRUFBRSxRQUFrQjtRQUM1QyxLQUFLLEVBQUUsQ0FBQztRQUpILFNBQUksR0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBS2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNGO0FBZEQsd0JBY0M7Ozs7OztBQ2hCRCxpQ0FBOEI7QUFDOUIscUNBQWtDO0FBQ2xDLHVDQUFvQztBQUNwQyxpQ0FBOEI7QUFHOUIsTUFBYSxJQUFJO0lBTWYsWUFBWSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFF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QyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDMUQsQ0FBQztJQUNKLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWdDLEVBQUUsSUFBVTtRQUNqRSxNQUFNLENBQUMsUUFBUSxDQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDWixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBL0JELG9CQStCQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IEJvZHksIFNpemUsIFZlbG9jaXR5LCBDZW50ZXIgfSBmcm9tIFwiLi9nbG9iYWxcIjtcblxuZXhwb3J0IGNsYXNzIEJ1bGxldCBleHRlbmRzIEJvZHkge1xuICBwdWJsaWMgc2l6ZTogU2l6ZSA9IHsgeDogMywgeTogMyB9O1xuICBwcm90ZWN0ZWQgdmVsb2NpdHk6IFZlbG9jaXR5O1xuXG4gIGNvbnN0cnVjdG9yKGNlbnRlcjogQ2VudGVyLCB2ZWxvY2l0eTogVmVsb2NpdHkpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudmVsb2NpdHkgPSB2ZWxvY2l0eTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoKSB7XG4gICAgdGhpcy5jZW50ZXIueCArPSB0aGlzLnZlbG9jaXR5Lng7XG4gICAgdGhpcy5jZW50ZXIueSArPSB0aGlzLnZlbG9jaXR5Lnk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFV0aWwgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IEludmFkZXIgfSBmcm9tIFwiLi9pbnZhZGVyXCI7XG5pbXBvcnQgeyBLRVlTIH0gZnJvbSBcIi4va2V5c1wiO1xuaW1wb3J0IHsgU2l6ZSwgQm9keSB9IGZyb20gXCIuL2dsb2JhbFwiO1xuXG5leHBvcnQgY2xhc3MgR2FtZSB7XG4gIHB1YmxpYyBnYW1lU2l6ZTogU2l6ZTtcbiAgcHJvdGVjdGVkIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIHByb3RlY3RlZCBib2RpZXM6IEJvZHlbXTtcbiAgcHJvdGVjdGVkIHNjcmVlbjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIGNvbnN0cnVjdG9yKGRvbUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JZCk7XG4gICAgdGhpcy5jYW52YXMub25jbGljayA9IHRoaXMucmVzZXQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdhbWVTaXplID0geyB4OiB0aGlzLmNhbnZhcy53aWR0aCwgeTogdGhpcy5jYW52YXMuaGVpZ2h0IH07XG4gICAgdGhpcy5zY3JlZW4gPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZUy5SKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRCb2R5KGJvZHk6IEJvZHkpIHtcbiAgICB0aGlzLmJvZGllcy5wdXNoKGJvZHkpO1xuICB9XG5cbiAgcHVibGljIHRpY2soKSB7XG4gICAgaWYgKCF0aGlzLmhhc1BsYXllcigpKSB7XG4gICAgICB0aGlzLmxvc2VHYW1lKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5oYXNJbnZhZGVycygpKSB7XG4gICAgICB0aGlzLndpbkdhbWUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgICB0aGlzLmRyYXcoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgaW52YWRlcnNCZWxvdyhpbnZhZGVyOiBJbnZhZGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9kaWVzLmZpbHRlcigoYm9keTogQm9keSkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgYm9keSBpbnN0YW5jZW9mIEludmFkZXIgJiZcbiAgICAgICAgYm9keS5jZW50ZXIueSA+IGludmFkZXIuY2VudGVyLnkgJiZcbiAgICAgICAgYm9keS5jZW50ZXIueCAtIGludmFkZXIuY2VudGVyLnggPCBpbnZhZGVyLnNpemUueFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydCgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVzZXQoKSB7XG4gICAgdGhpcy5ib2RpZXMgPSBVdGlsLnByb2R1Y2VJbnZhZGVycyh0aGlzKTtcbiAgICB0aGlzLmJvZGllcy5wdXNoKG5ldyBQbGF5ZXIodGhpcykpO1xuICAgIHRoaXMudGljaygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRyYXcoKSB7XG4gICAgdGhpcy5zY3JlZW4uY2xlYXJSZWN0KDAsIDAsIHRoaXMuZ2FtZVNpemUueCwgdGhpcy5nYW1lU2l6ZS55KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBVdGlsLmRyYXdSZWN0KHRoaXMuc2NyZWVuLCB0aGlzLmJvZGllc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZSgpIHtcbiAgICBsZXQgYm9kaWVzID0gdGhpcy5ib2RpZXM7XG4gICAgY29uc3Qgbm90Q29sbGlkaW5nV2l0aEFueXRoaW5nID0gKGIxOiBCb2R5KSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBib2RpZXMuZmlsdGVyKChiMjogQm9keSkgPT4ge1xuICAgICAgICAgIHJldHVybiBVdGlsLmNvbGxpZGluZyhiMSwgYjIpO1xuICAgICAgICB9KS5sZW5ndGggPT09IDBcbiAgICAgICk7XG4gICAgfTtcblxuICAgIHRoaXMuYm9kaWVzID0gdGhpcy5ib2RpZXMuZmlsdGVyKG5vdENvbGxpZGluZ1dpdGhBbnl0aGluZyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmJvZGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5ib2RpZXNbaV0udXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGhhc1BsYXllcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5ib2RpZXMuZmlsdGVyKChib2R5OiBCb2R5KSA9PiB7XG4gICAgICAgIHJldHVybiBib2R5IGluc3RhbmNlb2YgUGxheWVyO1xuICAgICAgfSkubGVuZ3RoID09PSAxXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBoYXNJbnZhZGVycygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5ib2RpZXMuZmlsdGVyKChib2R5OiBCb2R5KSA9PiB7XG4gICAgICAgIHJldHVybiBib2R5IGluc3RhbmNlb2YgSW52YWRlcjtcbiAgICAgIH0pLmxlbmd0aCA+IDBcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGxvc2VHYW1lKCkge1xuICAgIHRoaXMuZGlzcGxheU1lc3NhZ2UoXCJHYW1lIE92ZXJcIik7XG4gIH1cblxuICBwcm90ZWN0ZWQgd2luR2FtZSgpIHtcbiAgICB0aGlzLmRpc3BsYXlNZXNzYWdlKFwiWW91IHdpbiFcIik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGlzcGxheU1lc3NhZ2UodGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5zY3JlZW4uZm9udCA9IFwiNDhweCBzZXJpZlwiO1xuICAgIHRoaXMuc2NyZWVuLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgdGhpcy5zY3JlZW4uZmlsbFRleHQodGV4dCwgdGhpcy5nYW1lU2l6ZS54IC8gMiwgdGhpcy5nYW1lU2l6ZS55IC8gMik7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWZWxvY2l0eSB7XG4gIHB1YmxpYyB4OiBudW1iZXI7XG4gIHB1YmxpYyB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTaXplIHtcbiAgcHVibGljIHg6IG51bWJlcjtcbiAgcHVibGljIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENlbnRlciB7XG4gIHB1YmxpYyB4OiBudW1iZXI7XG4gIHB1YmxpYyB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCb2R5IHtcbiAgcHVibGljIGNlbnRlcjogQ2VudGVyO1xuICBwdWJsaWMgc2l6ZTogU2l6ZTtcblxuICBwdWJsaWMgYWJzdHJhY3QgdXBkYXRlKCk6IHZvaWQ7XG59XG4iLCJpbXBvcnQgeyBCdWxsZXQgfSBmcm9tIFwiLi9idWxsZXRcIjtcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgeyBCb2R5LCBTaXplLCBDZW50ZXIgfSBmcm9tIFwiLi9nbG9iYWxcIjtcblxuZXhwb3J0IGNsYXNzIEludmFkZXIgZXh0ZW5kcyBCb2R5IHtcbiAgcHVibGljIHNpemU6IFNpemUgPSB7IHg6IDE1LCB5OiAxNSB9O1xuICBwcm90ZWN0ZWQgZ2FtZTogR2FtZTtcbiAgcHJvdGVjdGVkIHBhdHJvbFg6IG51bWJlcjtcbiAgcHJvdGVjdGVkIHNwZWVkWDogbnVtYmVyO1xuICBwcm90ZWN0ZWQgYnVsbGV0Q2hhbmNlOiBudW1iZXIgPSAwLjk5O1xuXG4gIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUsIGNlbnRlcjogQ2VudGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMucGF0cm9sWCA9IDA7XG4gICAgdGhpcy5zcGVlZFggPSAwLjM7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIGlmICh0aGlzLnBhdHJvbFggPCAwIHx8IHRoaXMucGF0cm9sWCA+IDQwKSB7XG4gICAgICB0aGlzLnNwZWVkWCA9IC10aGlzLnNwZWVkWDtcbiAgICB9XG4gICAgdGhpcy5jZW50ZXIueCArPSB0aGlzLnNwZWVkWDtcbiAgICB0aGlzLnBhdHJvbFggKz0gdGhpcy5zcGVlZFg7XG5cbiAgICBpZiAoXG4gICAgICBNYXRoLnJhbmRvbSgpID4gdGhpcy5idWxsZXRDaGFuY2UgJiZcbiAgICAgICF0aGlzLmdhbWUuaW52YWRlcnNCZWxvdyh0aGlzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGxldCBidWxsZXQgPSBuZXcgQnVsbGV0KFxuICAgICAgICB7IHg6IHRoaXMuY2VudGVyLngsIHk6IHRoaXMuY2VudGVyLnkgKyB0aGlzLnNpemUueCAvIDIgfSxcbiAgICAgICAgeyB4OiBNYXRoLnJhbmRvbSgpIC0gMC41LCB5OiAyIH1cbiAgICAgICk7XG4gICAgICB0aGlzLmdhbWUuYWRkQm9keShidWxsZXQpO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEtleWJvYXJkZXIge1xuICBwcm90ZWN0ZWQga2V5U3RhdGU6IEJvb2xlYW5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBldmVudCA9PiB7XG4gICAgICB0aGlzLmtleVN0YXRlW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZXZlbnQgPT4ge1xuICAgICAgdGhpcy5rZXlTdGF0ZVtldmVudC5rZXlDb2RlXSA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGlzRG93bihrZXlDb2RlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlTdGF0ZVtrZXlDb2RlXSA9PT0gdHJ1ZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IEtFWVMgPSB7XG4gIExFRlQ6IDM3LFxuICBSOiA4MixcbiAgUklHSFQ6IDM5LFxuICBTUEFDRTogMzJcbn07XG4iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGdhbWUgPSBuZXcgR2FtZShcInNjcmVlblwiKTtcbiAgZ2FtZS5zdGFydCgpO1xufTtcbiIsImltcG9ydCB7IEJ1bGxldCB9IGZyb20gXCIuL2J1bGxldFwiO1xuaW1wb3J0IHsgS2V5Ym9hcmRlciB9IGZyb20gXCIuL2tleWJvYXJkZXJcIjtcbmltcG9ydCB7IEtFWVMgfSBmcm9tIFwiLi9rZXlzXCI7XG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xuaW1wb3J0IHsgQm9keSwgU2l6ZSB9IGZyb20gXCIuL2dsb2JhbFwiO1xuXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgQm9keSB7XG4gIHB1YmxpYyBzaXplOiBTaXplID0geyB4OiAxNSwgeTogMTUgfTtcbiAgcHJvdGVjdGVkIGtleWJvYXJkZXI6IEtleWJvYXJkZXI7XG4gIHByb3RlY3RlZCBnYW1lOiBHYW1lO1xuICBwcm90ZWN0ZWQgbGFzdFNob3Q6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBzaG90TGFnOiBudW1iZXIgPSAxMDA7XG5cbiAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLmtleWJvYXJkZXIgPSBuZXcgS2V5Ym9hcmRlcigpO1xuICAgIHRoaXMuY2VudGVyID0ge1xuICAgICAgeDogdGhpcy5nYW1lLmdhbWVTaXplLnggLyAyLFxuICAgICAgeTogdGhpcy5nYW1lLmdhbWVTaXplLnkgLSB0aGlzLnNpemUueFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMua2V5Ym9hcmRlci5pc0Rvd24oS0VZUy5MRUZUKSAmJlxuICAgICAgdGhpcy5jZW50ZXIueCAtIHRoaXMuc2l6ZS54IC8gMiA+IDBcbiAgICApIHtcbiAgICAgIHRoaXMuY2VudGVyLnggLT0gMjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5rZXlib2FyZGVyLmlzRG93bihLRVlTLlJJR0hUKSAmJlxuICAgICAgdGhpcy5jZW50ZXIueCArIHRoaXMuc2l6ZS54IC8gMiA8IHRoaXMuZ2FtZS5nYW1lU2l6ZS54XG4gICAgKSB7XG4gICAgICB0aGlzLmNlbnRlci54ICs9IDI7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMua2V5Ym9hcmRlci5pc0Rvd24oS0VZUy5TUEFDRSkpIHtcbiAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgaWYgKG5vdyAtIHRoaXMubGFzdFNob3QgPCB0aGlzLnNob3RMYWcpIHJldHVybjtcbiAgICAgIHRoaXMubGFzdFNob3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIGxldCBidWxsZXQgPSBuZXcgQnVsbGV0KFxuICAgICAgICB7IHg6IHRoaXMuY2VudGVyLngsIHk6IHRoaXMuY2VudGVyLnkgLSB0aGlzLnNpemUueCAvIDIgfSxcbiAgICAgICAgeyB4OiAwLCB5OiAtNiB9XG4gICAgICApO1xuICAgICAgdGhpcy5nYW1lLmFkZEJvZHkoYnVsbGV0KTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IEludmFkZXIgfSBmcm9tIFwiLi9pbnZhZGVyXCI7XG5pbXBvcnQgeyBCb2R5IH0gZnJvbSBcIi4vZ2xvYmFsXCI7XG5cbmV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgcHVibGljIHN0YXRpYyBwcm9kdWNlSW52YWRlcnMoZ2FtZTogYW55KSB7XG4gICAgbGV0IGludmFkZXJzOiBJbnZhZGVyW10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjQ7IGkrKykge1xuICAgICAgbGV0IHggPSAzMCArIChpICUgOCkgKiAzMDtcbiAgICAgIGxldCB5ID0gMzAgKyAoaSAlIDMpICogMzA7XG4gICAgICBpbnZhZGVycy5wdXNoKG5ldyBJbnZhZGVyKGdhbWUsIHsgeDogeCwgeTogeSB9KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGludmFkZXJzO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBjb2xsaWRpbmcoYjE6IEJvZHksIGIyOiBCb2R5KSB7XG4gICAgcmV0dXJuICEoXG4gICAgICBiMSA9PT0gYjIgfHxcbiAgICAgIGIxLmNlbnRlci54ICsgYjEuc2l6ZS54IC8gMiA8IGIyLmNlbnRlci54ICsgYjIuc2l6ZS54IC8gMiB8fFxuICAgICAgYjEuY2VudGVyLnkgKyBiMS5zaXplLnkgLyAyIDwgYjIuY2VudGVyLnkgKyBiMi5zaXplLnkgLyAyIHx8XG4gICAgICBiMS5jZW50ZXIueCAtIGIxLnNpemUueCAvIDIgPiBiMi5jZW50ZXIueCArIGIyLnNpemUueCAvIDIgfHxcbiAgICAgIGIxLmNlbnRlci55IC0gYjEuc2l6ZS55IC8gMiA+IGIyLmNlbnRlci55ICsgYjIuc2l6ZS55IC8gMlxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGRyYXdSZWN0KHNjcmVlbjogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBib2R5OiBCb2R5KSB7XG4gICAgc2NyZWVuLmZpbGxSZWN0KFxuICAgICAgYm9keS5jZW50ZXIueCAtIGJvZHkuc2l6ZS54IC8gMixcbiAgICAgIGJvZHkuY2VudGVyLnkgLSBib2R5LnNpemUueSAvIDIsXG4gICAgICBib2R5LnNpemUueCxcbiAgICAgIGJvZHkuc2l6ZS55XG4gICAgKTtcbiAgfVxufVxuIl19
