import {assert} from "./tests";

const player = require("../game/player");
import {Potion} from "../game/potion";

export class PotionTests {
    use_potion() {
        let p = new player.Player;
        p.attributes.insight = 5;
        p.attributes.health = 1;

        let potion = new Potion;
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

        let potion = new Potion;
        potion.from({health: 5}); // the rest is undefined!
        potion.use(p);

        assert.equal(p.attributes.health, 6);
        assert.equal(p.attributes.insight, 5);
    }

    /// watch for potion to wear off
    debuff_potion() {
        let p = new player.Player;

        let potion = new Potion;
        potion.from({
            health: 5,
            insight: 10,
            debuff: 
                {time: 0, ignore: ["health"]}
        });
        potion.use(p);

        setTimeout(() => {
            assert.equal(p.attributes.health, 5);
            assert.equal(p.attributes.insight, 0);
        }, 1);
    }
}