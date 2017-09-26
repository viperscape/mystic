import {Attributes} from "./attr";

export class AI {
    protected influencers: {string:Influencer};

    constructor (is?: {string:Influencer}) {
        if (is) this.influencers = is;
    }

    step() {
        for (var i in this.influencers) {
            this.influencers[i].process();
        }
    }

    insert (name: string, i:Influencer) {
        this.influencers[name] = i;
    }

    remove (name:string) { delete this.influencers[name] }
}

export class Influencer {
    fn: () => number;
    total: number;
    next: () => number;

    constructor (next: () => number, fn: () => number) {
        this.fn = fn;
        this.total = 0.5;
        this.next = next;
    }
    process() { 
        this.total += this.fn(); 
        if (this.total > 1) {
            this.fn = this.next;
        }
     }
}

export class CombatAI {
    state: (() => void)[];
    observe: Attributes;

    constructor (attr: Attributes) {
        this.state = [this.patrol];
        this.observe = attr;
    }

    process() {
        let last = this.state[this.state.length];
        if (this.observe.health < 20) {
            if (last != this.flee) this.state.push(this.flee);
        }
        else if (!last) this.state.push(this.patrol);

        this.state[this.state.length]();
    }

    flee () {
        console.log("flee");
        if (this.observe.health > 25) this.state.pop();
    }
    attack () { console.log("attack") }
    patrol () { console.log("patrol") }
}