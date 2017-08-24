"use strict";
exports.__esModule = true;
var tests_1 = require("./tests");
var player = require("../game/player");
var items = require("../game/items");
var PotionTests = /** @class */ (function () {
    function PotionTests() {
    }
    PotionTests.prototype.use_potion = function () {
        var p = new player.Player;
        p.attributes.insight = 5;
        p.attributes.health = 1;
        var potion = new items.Potion;
        potion.attributes.health = 5;
        potion.attributes.insight = -3;
        potion.use(p);
        tests_1.assert.equal(p.attributes.health, 6);
        tests_1.assert.equal(p.attributes.insight, 2);
        potion.unuse(p); //should reset to original status
        tests_1.assert.equal(p.attributes.health, 1);
        tests_1.assert.equal(p.attributes.insight, 5);
    };
    PotionTests.prototype.undefined_potion_attributes = function () {
        var p = new player.Player;
        p.attributes.insight = 5;
        p.attributes.health = 1;
        var potion = new items.Potion;
        potion.from({ health: 5 }); // the rest is undefined!
        potion.use(p);
        tests_1.assert.equal(p.attributes.health, 6);
        tests_1.assert.equal(p.attributes.insight, 5);
    };
    /// watch for potion to wear off
    PotionTests.prototype.debuff_potion = function () {
        var p = new player.Player;
        var potion = new items.Potion;
        potion.from({
            "health": 5,
            "insight": 10,
            "unuse": { "time": 0, "ignore": ["health"] }
        });
        potion.use(p);
        setTimeout(function () {
            tests_1.assert.equal(p.attributes.health, 5);
            tests_1.assert.equal(p.attributes.insight, 0);
        }, 1);
    };
    return PotionTests;
}());
exports.PotionTests = PotionTests;
