const items = require("../assets/items.json");

export function load(): any {
    return items;
}

class Potion {
    name: string;
    kind: string;

    //modifiers
    strength: number;
    stamina: number;
    health: number;
}