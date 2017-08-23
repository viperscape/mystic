"use strict";
exports.__esModule = true;
var items_1 = require("./items");
var Player = /** @class */ (function () {
    function Player() {
        this.items = new items_1.Items;
        this.attributes = new Attributes;
    }
    return Player;
}());
exports.Player = Player;
var Attributes = /** @class */ (function () {
    function Attributes() {
        this.strength = 0;
        this.stamina = 0;
        this.health = 0;
        this.concentration = 0;
        this.insight = 0;
    }
    Attributes.prototype.from = function (obj) {
        var or_default = function (x) {
            return (x === undefined) ? 0 : x;
        };
        this.strength = or_default(obj["strength"]);
        this.stamina = or_default(obj["stamina"]);
        this.health = or_default(obj["health"]);
        this.concentration = or_default(obj["concentration"]);
        this.insight = or_default(obj["insight"]);
    };
    return Attributes;
}());
exports.Attributes = Attributes;
