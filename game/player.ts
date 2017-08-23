import {Items,Potion} from "./items";

export class Player {
    items: Items;

    attributes: Attributes;

    constructor() {
        this.items = new Items;
        this.attributes = new Attributes;
    }
}

export class Attributes {
    strength = 0;
    stamina = 0;
    health = 0;
    concentration = 0;
    insight = 0;

    from(obj: Object) {
        this.strength = obj["strength"];
        this.stamina = obj["stamia"];
        this.health = obj["health"];
        this.concentration = obj["concentration"];
        this.insight = obj["insight"];
    }
}