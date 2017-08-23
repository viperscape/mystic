const items_ = require("../assets/items.json");

// NOTE: from methods transform a generic Object parsed from JSON into said class

export function load(): Items {
    let i = new Items;
    i.from(items_);
    return i;
}

class Items {
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

class Potion {
    name: string;
    kind: string;
    // TODO: add a description field?

    //modifiers
    strength: number;
    stamina: number;
    health: number;
    concentration: number;
    insight: number;

    constructor () { // set defaults, makes applying these later a cinch
        this.name = "unknown potion";
        this.kind = "unknown kind";
        this.strength = 0;
        this.stamina = 0;
        this.health = 0;
        this.concentration = 0;
        this.insight = 0;
    }

    from(obj: Object) {
        this.name = obj["name"];
        this.kind = obj["kind"];

        this.strength = obj["strength"];
        this.stamina = obj["stamia"];
        this.health = obj["health"];
        this.concentration = obj["concentration"];
        this.insight = obj["insight"];
    }
}