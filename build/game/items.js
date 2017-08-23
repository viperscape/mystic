"use strict";
exports.__esModule = true;
var items_ = require("../assets/items.json");
// NOTE: from methods transform a generic Object parsed from JSON into said class
function load() {
    var i = new Items;
    i.from(items_);
    return i;
}
exports.load = load;
var Items = /** @class */ (function () {
    function Items() {
        this.potions = [];
    }
    Items.prototype.from = function (obj) {
        var _this = this;
        obj["potions"].forEach(function (element) {
            var p = new Potion;
            p.from(element);
            _this.potions.push(p);
        });
    };
    return Items;
}());
var Potion = /** @class */ (function () {
    function Potion() {
        this.name = "unknown potion";
        this.kind = "unknown kind";
        this.strength = 0;
        this.stamina = 0;
        this.health = 0;
        this.concentration = 0;
        this.insight = 0;
    }
    Potion.prototype.from = function (obj) {
        this.name = obj["name"];
        this.kind = obj["kind"];
        this.strength = obj["strength"];
        this.stamina = obj["stamia"];
        this.health = obj["health"];
        this.concentration = obj["concentration"];
        this.insight = obj["insight"];
    };
    return Potion;
}());
