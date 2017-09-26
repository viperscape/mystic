export class AI {
    influencers: Influencer[]

    step(): AI {
        for (var i in this.influencers) {
            let result = this.influencers[i].process();
            if (result) return result;
        }
    }
}

export class Influencer {
    fn: () => number;
    total: number;
    next: AI;

    constructor (next: AI, fn: () => number) {
        this.fn = fn;
        this.total = 0;
        this.next = next;
    }
    process(): AI { 
        this.total += this.fn(); 
        if (this.total > 1) {
            return this.next;
        }
     }
}