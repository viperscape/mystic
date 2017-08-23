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
    }
}