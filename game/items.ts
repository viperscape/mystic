const items_ = require("../assets/items.json");
import {Attributes, Player} from "./player";

// NOTE: from methods transform a generic Object parsed from JSON into said class

/// load items from game data
export function load(): Items {
    let i = new Items;
    i.from(items_);
    return i;
}

export class Items {
    potions: Potion[];

    constructor () {
        this.potions = [];
    }

    from(obj:Object) {
        obj["potions"].forEach(element => {
            let p = new Potion;
            p.from(element);
            this.potions.push(p);
        });
    }
}

export class Potion {
    name: string;
    kind: string;
    // TODO: add a description field?

    //modifiers
    attributes: Attributes;

    constructor () {
        this.name = "unknown potion";
        this.kind = "unknown kind";
        this.attributes = new Attributes;
    }

    from(obj: Object) {
        this.name = obj["name"];
        this.kind = obj["kind"];
        this.attributes.from(obj);
    }

    use(p: Player) {
        for (var i in this.attributes) { // assumes Attributes match!
            if (this.attributes.hasOwnProperty(i)) { // only properties!
                p.attributes[i] += this.attributes[i]; // apply modifiers
            }
        }
    }
    unuse(p: Player) {
        for (var i in this.attributes) { // assumes Attributes match!
            if (this.attributes.hasOwnProperty(i)) { // only properties!
                p.attributes[i] -= this.attributes[i]; // apply modifiers
            }
        }
    }
}