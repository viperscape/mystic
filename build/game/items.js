"use strict";
exports.__esModule = true;
var items_ = require("../assets/items.json");
var player_1 = require("./player");
// NOTE: from methods transform a generic Object parsed from JSON into said class
/// load items from game data
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
exports.Items = Items;
var Potion = /** @class */ (function () {
    function Potion() {
        this.debuff = new Debuff;
        this.name = "unknown potion";
        this.kind = "unknown kind";
        this.attributes = new player_1.Attributes;
    }
    Potion.prototype.from = function (obj) {
        this.name = obj["name"];
        this.kind = obj["kind"];
        this.debuff.from(obj["debuff"]);
        this.attributes.from(obj);
    };
    Potion.prototype.use = function (p) {
        var _this = this;
        for (var i in this.attributes) {
            if (this.attributes.hasOwnProperty(i)) {
                p.attributes[i] += this.attributes[i]; // apply modifiers
            }
        }
        if (this.debuff.time) {
            setTimeout(function () {
                _this.unuse(p, _this.debuff.ignore);
            }, this.debuff.time);
        }
    };
    Potion.prototype.unuse = function (p, ignore) {
        for (var i in this.attributes) {
            if ((ignore) && (ignore.indexOf(i) > -1))
                continue; //ignore perm buffs
            if (this.attributes.hasOwnProperty(i)) {
                p.attributes[i] -= this.attributes[i]; // apply modifiers
            }
        }
    };
    return Potion;
}());
exports.Potion = Potion;
var Debuff = /** @class */ (function () {
    function Debuff() {
        this.ignore = [];
    }
    Debuff.prototype.from = function (obj) {
        this.time =
            ((obj["time"] === undefined) &&
                (typeof obj["time"] == 'number')) ?
                undefined : obj["time"];
        this.ignore =
            ((obj["ignore"] === undefined) &&
                (obj["ignore"].constructor === Array)) ?
                [] : obj["ignore"];
    };
    return Debuff;
}());
exports.Debuff = Debuff;
