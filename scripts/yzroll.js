export class YZRoll {

    rollResults = {
        base:{},
        skill:{},
        gear:{},
        artifact:{}
    }
    
    sb = {
        base: [0,0],
        skill:[0,0],
        gear:[0,0],
        artifact: [0,0] 
    }

    dmgDice = [];
    statDice = [];
    skillDice = [];
    gearDice = [];
    artDice = [];
    pushed = false;

    constructor(data) {
        this.statDice = data.statDice;
        this.skillDice = data.skillDice;
        this.gearDice = data.gearDice;
        this.artDice = data.artDice;
        this.dmgDice = data.dmgDice;
    }

    doRoll() {

            // Stat Dice Results
            this.statDice.forEach(s => {
                let sr = new Roll(d);
                sr.evaluate({async:false});
                this.rollResults.base[d] = sr.total;
            });

            this.skillDice.forEach(k => {
                let kr = new Roll(k);
                kr.evaluate({async:false});
                this.rollResults.base[k] = kr.total;
            });

            this.gearDice.forEach(g => {
                let gr = new Roll(g);
                gr.evaluate({async:false});
                this.rollResults.base[g] = gr.total;
            });

            this.artDice.forEach(a => {
                let ar = new Roll(a);
                ar.evaluate({async:false});
                this.rollResults.artifact[a] = ar.total;
            });

            parseSuccesses();
        
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

        parseSuccesses();
    }

     //Determine number of successes, banes, and assemble an array including only dice that remain pushable
     parseSuccess() {

            let keyArray = ["base", "skill", "gear", "artifact"];

            keyArray.forEach(k => {

                for (const d in this.rollResults[k]) {

                    if(this.rollResults[k][d] == 1) {
                        this.sb[k][1] += 1;
                    } else if (this.rollResults[k][d] >= 6 && this.rollResults[k][d] < 10) {
                        this.sb[k][0] += 1;
                    } else if (this.rollResults[k][d] >= 10) {
                        this.sb[k][0] += 2;
                    }
                }

            });

     }
 
}