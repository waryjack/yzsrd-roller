export class YZRoll {

    statDice = [];
    statVals = {};
    skillDice = [];
    skillVals = {};
    gearDice = [];
    gearVals = {};
    artDice = [];
    artVals = {};
    statSux = 0;
    statBanes = 0;
    skillSux = 0;
    skillBanes = 0;
    gearSux = 0;
    gearBanes = 0;
    artSux = 0;
    artBanes = 0;
    pushed = false;

    constructor(data) {
        this.statDice = data.statDice;
        this.skillDice = data.skillDice;
        this.gearDice = data.gearDice;
        this.artDice = data.artDice;
        this.dmgDice = data.dmgDice;
    }

    rollDice() {

            // Stat Dice Results
            this.statDice.forEach(s => {
                let sr = new Roll(d);
                sr.evaluate({async:false});
                this.statVals[d] = sr.total;
            });

            this.skillDice.forEach(k => {
                let kr = new Roll(k);
                kr.evaluate({async:false});
                this.skillVals[k] = kr.total;
            });

            this.gearDice.forEach(g => {
                let gr = new Roll(g);
                gr.evaluate({async:false});
                this.gearVals[g] = gr.total;
            });

            this.artDice.forEach(a => {
                let ar = new Roll(a);
                ar.evaluate({async:false});
                this.artVals[a] = ar.total;
            });
        
    }

   
    /**
     * @param {Roll} the roll to push
     * @param {Actor} the actor triggering the push
     */
    pushRoll() {

        if(!pushed) {
            for (const s in this.statVals) {
                if (this.statVals[s] != 1) {
                    this.statVals[s] = new Roll(s).evaluate({async:false}).total;
                }
            }
            for (const k in this.skillVals) {
                if (this.skillVals[k] != 1) {
                    this.skillVals[k] = new Roll(k).evaluate({async:false}).total;
                }
            }
            
            for (const g in this.gearVals) {
                if (this.gearVals[g] != 1) {
                    this.gearVals[g] = new Roll(g).evaluate({async:false}).total;
                }
            }
            
            for (const a in this.artVals) {
                if (this.artVals[a] != 1) {
                    this.artVals[a] = new Roll(a).evaluate({async:false}).total;
                }
            }
        }

    }

     //Determine number of successes, banes, and assemble an array including only dice that remain pushable
     parseSuccess() {

            for (const s in this.statVals) {
                if (this.statVals[s] == 1) {
                    this.statBanes += 1;
                } else if (this.statVals[s] >= 6 && this.statVals[s] < 10) {
                    this.statSux += 1;
                } else if (this.statVals[s] >= 10) {
                    this.statSux += 2;
                }
            }
            for (const s in this.skillVals) {
                if (this.skillVals[s] == 1) {
                    this.skillBanes += 1;
                } else if (this.skillVals[s] >= 6 && this.skillVals[s] < 10) {
                    this.skillSux += 1;
                } else if (this.skillVals[s] >= 10) {
                    this.skillSux += 2;
                }
            }
            for (const s in this.gearVals) {
                if (this.gearVals[s] == 1) {
                    this.gearBanes += 1;
                } else if (this.gearVals[s] >= 6 && this.gearVals[s] < 10) {
                    this.gearSux += 1;
                } else if (this.gearVals[s] >= 10) {
                    this.gearSux += 2;
                }
            }
            for (const s in this.artVals) {
                if (this.artVals[s] == 1) {
                    this.artBanes += 1;
                } else if (this.artVals[s] >= 6 && this.artVals[s] < 10) {
                    this.artSux += 1;
                } else if (this.artVals[s] >= 10) {
                    this.artSux += 2;
                }
            }

     }
 
}