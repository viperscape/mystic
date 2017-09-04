const items_ = require("../assets/items.json");
import {Potion,PotionRenderable} from "./potion";

// NOTE: from methods transform a generic Object parsed from JSON into said class

/// load items from game data
export function load(cb: (i:Items) => void) {
    let i = new Items;
    i.from(items_);
    await_items(i, function () {
        cb(i);
    });
}

function await_items (i: Items, cb: () => void) {
    setTimeout(function () {
        if (i.loading > 0) await_items(i,cb);
        else { cb() }
    }, 50);
}

export class Items {
    potions: Potion[];
    potion_models: {string:PotionRenderable}[];
    loading = 0;

    constructor () {
        this.potions = [];
        this.potion_models = [];
    }

    from(obj:Object) {
        obj["potions"].forEach(element => {
            let p = new Potion;
            p.from(element);
            if (!this.potion_models[p.kind]) {
                this.loading += 1;
                let r = new PotionRenderable(p, () => { this.loading -= 1 });
                this.potion_models[p.kind] = r; //NOTE: we may change this to name for one-off special renderings
            }
            this.potions.push(p);
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