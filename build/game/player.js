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
        this.strength = obj["strength"];
        this.stamina = obj["stamia"];
        this.health = obj["health"];
        this.concentration = obj["concentration"];
        this.insight = obj["insight"];
    };
    return Attributes;
}());
exports.Attributes = Attributes;