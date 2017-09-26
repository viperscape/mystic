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

// NOTE: if this shapes up, we'll rename to AI and drop the above concept
export class CombatAI {
    state: {trigger,action,release?}[];
    states: {default};

    constructor (attr: Attributes, states: {default}) {
        this.state = [states.default];
        this.states = states;
    }

    process() {
        console.log(last(this.state))
        for (var state in this.states) {
            let new_state = this.states[state];
            if (new_state.trigger()) {
                if (new_state.action != last(this.state)) {
                    this.state.push(new_state.action);
                    break;
                }
            }
            else if ((last(this.state).release) &&
                (last(this.state).release())) {
                this.state.pop();
                break;
            }
        }

        last(this.state).action();
    }
}

function last (a: any[]): any {
    return a[a.length-1]
}