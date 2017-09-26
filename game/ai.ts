export class AI<S> {
    influencers: Influencer<S>[]

    step(s: S) {
        this.influencers.forEach((i) => {
            let result = i.process(s);
            if (result > 1) {
                
            }
        });
    }
}

export class Influencer<S> {
    fn: (s: S) => number;
    total: number;

    constructor (fn: (s: S) => number) {
        this.fn = fn;
        this.total = 0;
    }
    process(s: S): number { 
        this.total += this.fn(s); 
        return this.total;
     }
}