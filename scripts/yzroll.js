export class YZRoll {


    rollResults = {
        base,
        skill,
        gear,
        artifact
    }
    
    sb = {
        base: [0,0],
        skill:[0,0],
        gear:[0,0],
        artifact: [0,0] 
    }

    // For step dice, the value corresponds to the die: 0 = none, 1= d6, 2 = d8, 3 = d10, 4 = d12
    // For dice pools, the value is the number of dice to roll, e.g. 3 = 3d6

    dmgDice = 0;
    statDice = 0;
    skillDice = 0;
    gearDice = 0;
    artDice = 0;
    pushed = false;

    constructor(data) {
        this.statDice = data.statDice;
        this.skillDice = data.skillDice;
        this.gearDice = data.gearDice;
        this.artDice = data.artDice;
        this.dmgDice = data.dmgDice;
    }

   
    /**
     * @param {Roll} the roll to push
     * @param {Actor} the actor triggering the push
     */
    pushRoll() {

        let keyArray = ["base", "skill", "gear", "artifact"];
        let res = this.rollResults;

        if(rollMode == 0) {
            keyArray.forEach(k => {

                for (const d in res[k]) {
                    // so the keys in res.base, res.skill, etc.
                    rerollExpr = d;
                    if(res[k][d] == 1) {
                        //do nothing
                    } else {
                        let reroll = new Roll(rerollExpr).evaluate({async:false});
                        res[k][d] = reroll.total;
                    }
                }

            });

            this.rollResults = res;

        } else if (rollMode == 1) {

         //dice pool push here





        } else {
            console.log("Unknown roll mode!")
            return;
        }

        _parseSuccesses();

    }

     //Determine number of successes, banes, and assemble an array including only dice that remain pushable
     _parseSuccess(resultObject) {
        
        let keyArray = ["base", "skill", "gear", "artifact"];
        if(rollMode == 0) {

            keyArray.forEach(k => {

                for (const d in resultObject[k]) {

                    if(resultObject[k][d] == 1) {
                        this.sb[k][1] += 1;
                    } else if (resultObject[k][d] >= 6 && resultObject[k][d] < 10) {
                        this.sb[k][0] += 1;
                    } else if (resultObject[k][d] >= 10) {
                        this.sb[k][0] += 2;
                    }
                }

            });
        } else if (rollMode == 1) {

            keyArray.forEach(k => {
                
                resultObject[k].forEach(r => {
                    if(r == 1) { 
                        this.sb[k][1] += 1;
                    } else if (r >= 6 && r < 10) {
                        this.sb[k][0] += 1;
                    } else if (r >= 10) {
                        this.sb[k][0] += 2;
                    }

                })

            })


        }

            

     }

     doStepRoll() {
        
        let statExpr = _getDieExpression(this.statDice);
        let skillExpr = _getDieExpression(this.skillDice);
        let gearExpr = _getDieExpression(this.gearDice);
        let artExpr = _getDieExpression(this.artDice);

        let statRoll = [new Roll(statExpr).evaluate({async:false}).total];
        let skillRoll = [new Roll(skillExpr).evaluate({async:false}).total];
        let gearRoll = [new Roll(gearExpr).evaluate({async:false}).total];
        let artifactRoll = [new Roll(artExpr).evaluate({async:false}).total];
       
        let res = {
            base:{},
            skill:{},
            gear:{},
            artifact:{}
        };

        res.base[statExpr] = statRoll;
        res.skill[skillExpr] = skillRoll;
        res.gear[gearExpr] = gearRoll;
        res.artifact[artExpr] = artifactRoll;
        
        this.rollResults = res;

        _parseSuccess(res);
     }

     

     doPoolRoll() {

        let str = new Roll(this.statDice+"d6");
        str.evaluate({async:false});
        let skr = new Roll(this.skillDice+"d6");
        skr.evaluate({async:false});
        let gr = new Roll(this.gearDice+"d6");
        gr.evaluate({async:false});
        let ar = new Roll(this.artDice+"d6");
        ar.evaluate({async:false});

        let statRolls = str.result.split(" + ");
        let skillRolls = skr.result.split(" + ");
        let gearRolls = gr.result.split(" + ");
        let artRolls = ar.result.split(" + ");

        let res = {
            base:statRolls,
            skill: skillRolls,
            gear: gearRolls,
            artifact: artRolls
        }

        this.rollResults = res;

        _parseSuccesses(res);

     }
 
     _getDieExpression(dieCode) {
            let expr = "None";
            switch(dieCode) {
                case 0: break;
                case 1: expr = "1d6"; break;
                case 2: expr = "1d8"; break;
                case 3: expr = "1d10"; break;
                case 4: expr = "1d12"; break;
            }

            return expr;
    }
}