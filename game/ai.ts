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
        for (var state in this.states) {
            let new_state = this.states[state];
            let last_state = last(this.state);
            if (new_state.trigger()) {
                if (new_state != last_state) {
                    if (!this.push_lock) {
                        this.state.push(new_state);
                        this.push_lock = new_state.push_lock; // we only care if this is true
                    }

                    break; // NOTE: break regardless of lock state
                }
            }
            else if ((last_state.release) &&
                (last_state.release())) {
                last_state = this.state.pop();
                if (last_state.push_lock) this.push_lock = false;
                break;
            }
        }

        last(this.state).action();
    }
}

function last (a: any[]): any {
    return a[a.length-1]
}