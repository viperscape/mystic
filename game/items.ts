const items_ = require("../assets/items.json");
import {Potion,PotionRenderable} from "./potion";

// NOTE: from methods transform a generic Object parsed from JSON into said class

/// load items from game data
export function load(): Items {
    let i = new Items;
    i.from(items_);
    return i;
}

export class Items {
    potions: Potion[];
    potion_models: {string:PotionRenderable}[];

    constructor () {
        this.potions = [];
        this.potion_models = [];
    }

    from(obj:Object) {
        obj["potions"].forEach(element => {
            let p = new Potion;
            p.from(element);
            let r = new PotionRenderable(p);
            this.potions.push(p);
            this.potion_models[p.kind] = r; //NOTE: we may change this to name for one-off special renderings
        });
    }

    find(item: string, comp: {}): any[] {
        let m = [];
        let search;
        if (item == "potion") search = this.potions;

        if (search) {
            for (var e in search) {
                var matches = true;
                for (var prop in comp) {
                    if (!search[e].hasOwnProperty(prop)) matches = false;
                    else matches = (search[e][prop] === comp[prop])
                }

                if (matches) m.push(search[e]);
            }
        }

        return m;
    }
}