import {assert} from "./tests";

const player = require("../game/player");
const items = require("../game/items");

export class PotionTests {
    use_potion() {
        let p = new player.Player;
        p.attributes.insight = 5;
        p.attributes.health = 1;

        let potion = new items.Potion;
        potion.attributes.health = 5;
        potion.attributes.insight = -3;
        potion.use(p);

        assert.equal(p.attributes.health, 6);
        assert.equal(p.attributes.insight, 2);

        potion.unuse(p); //should reset to original status
        assert.equal(p.attributes.health, 1);
        assert.equal(p.attributes.insight, 5);
    }

    undefined_potion_attributes () {
        let p = new player.Player;
        p.attributes.insight = 5;
        p.attributes.health = 1;

        let potion = new items.Potion;
        potion.from({health: 5}); // the rest is undefined!
        potion.use(p);

        assert.equal(p.attributes.health, 6);
        assert.equal(p.attributes.insight, 5);
    }
}