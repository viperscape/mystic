import {Attributes} from "./attr";

export class AI {
    state: {trigger,action,release?, push_lock?}[];
    states: {default};
    push_lock = false;

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
                    if (!this.push_lock) {
                        this.state.push(new_state.action);
                        this.push_lock = new_state.push_lock; // we only care if this is true
                    }

                    break; // NOTE: break regardless of lock state
                }
            }
            else if ((last(this.state).release) &&
                (last(this.state).release())) {
                let old_state = this.state.pop();
                if (old_state.push_lock) this.push_lock = false;
                break;
            }
        }

        last(this.state).action();
    }
}

function last (a: any[]): any {
    return a[a.length-1]
}