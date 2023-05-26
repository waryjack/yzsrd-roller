export class YZRoll {


    rollResults = {
        base:[],
        skill:[],
        gear:[],
        artifact:[]
    }
    
    sb = {
        base: [0,0],
        skill:[0,0],
        gear:[0,0],
        artifact: [0,0] 
    }

    // For step dice, the value corresponds to the die: 0 = none, 1= d6, 2 = d8, 3 = d10, 4 = d12
    // For dice pools, the value is the number of dice to roll, e.g. 3 = 3d6
    successes = 0;
    banes = 0;
    dmgDice = 0;
    statDice = 0;
    skillDice = 0;
    gearDice = 0;
    artDice = 0;
    isPush = false;
    diceDisplay = "";
    evaluatedRoll = null;
    stepDice = false;


    constructor(data, push) {
        console.log("Is this a push? ", push);
        console.log(data); 

        if(!push) {
            this.statDice = data.statDice;
            this.skillDice = data.skillDice;
            this.gearDice = data.gearDice;
            this.artDice = data.artDice;
            this.dmgDice = data.dmgDice;
            this.stepDice =  game.settings.get("yzsrd-roller", "stepDice");
        } else {
            this.statDice = data.statDice;
            this.skillDice = data.skillDice;
            this.gearDice = data.gearDice;
            this.artDice = data.artDice;
            this.dmgDice = data.dmgDice;
            this.stepDice =  game.settings.get("yzsrd-roller", "stepDice");


            this.rollResults = data.rollResults;

            this.sb = data.sb;
            this.successes = data.successes;
            this.banes = data.banes;
            this.isPush = true;
        }
    }

   
    /**
     * @param {Roll} the roll to push
     * @param {Actor} the actor triggering the push
     */
    pushRoll() {

        this.successes = 0;
        this.banes = 0;
        console.log("the pushed roll: ", this);
       
        let keyArray = ["base", "skill", "gear", "artifact"];
        let res = this.rollResults;

        if(this.stepDice) {
            keyArray.forEach(k => {

                    let rerollExpr = res[k][0];
                    if(res[k][1] == 1 || res[k][1] == "-") {
                        //do nothing
                    } else {
                        let reroll = new Roll(rerollExpr).evaluate({async:false});
                        res[k][1] = reroll.total;
                    }
                

            });

            console.log("REsults after push: ", res);
            this.rollResults = res;
            this.isPush = true;

        } else {

            keyArray.forEach(k => {

                // let rerollExpr = res[k][0];
                
                res[k].forEach(v => {
                    if(res[k].indexOf(v) == 0) {
                        //do nothing
                    } else if(v == 1 || v == "-") {
                        //do nothing
                    } else {
                        let reroll = new Roll("1d6").evaluate({async:false});
                        let loc = res[k].indexOf(v);
                        res[k][loc] = reroll.result;
                        
                    }


                });
               
            });    
            

        }

        console.log("REsults after push: ", res);
        this.rollResults = res;
        this.isPush = true;

        this._parseSuccess(res);

    }

     //Determine number of successes, banes, and assemble an array including only dice that remain pushable
     _parseSuccess(resultObject) {
        let rollMode = 1;
        let keyArray = ["base", "skill", "gear", "artifact"];
        if(this.stepDice) {

            keyArray.forEach(k => {

                    if(resultObject[k][1] == 1) {
                        this.sb[k][1] += 1;
                        this.banes += 1;
                    } else if (resultObject[k][1] >= 6 && resultObject[k][1] < 10) {
                        this.sb[k][0] += 1;
                        this.successes += 1;
                    } else if (resultObject[k][1] >= 10) {
                        this.sb[k][0] += 2;
                        this.successes += 2;
                    } else if (resultObject[k][1] == "-") {
                        // do nothing, count nothing
                    }
                });

        } else {

            keyArray.forEach(k => {

                resultObject[k].forEach(r => {
                    if(resultObject[k].indexOf(r) == 0) {
                        //do nothing, this is the die formula
                    } else if(r == 1) { 
                        this.sb[k][1] += 1;
                        this.banes += 1;
                    } else if (r >= 6 && r < 10) {
                        this.sb[k][0] += 1;
                        this.successes += 1;
                    } else if (r >= 10) {
                        this.sb[k][0] += 2;
                        this.successes += 2;
                    }

                })

            })


        }

            

     }

     doStepRoll() {
        
        let statExpr = this.getDieExpression(this.statDice);
        let skillExpr = this.getDieExpression(this.skillDice);
        let gearExpr = this.getDieExpression(this.gearDice);
        let artExpr = this.getDieExpression(this.artDice);
        let statRoll = 0;
        let skillRoll = 0;
        let gearRoll = 0;
        let artifactRoll = 0;

        if (statExpr != "None") {
            statRoll = [new Roll(statExpr).evaluate({async:false}).total];
        } else {
            statRoll = "-"
        }

        if (skillExpr != "None") {
            skillRoll = [new Roll(skillExpr).evaluate({async:false}).total];
        } else {
            skillRoll = "-"
        }

        if(gearExpr != "None") {
            gearRoll = [new Roll(gearExpr).evaluate({async:false}).total];
        } else {
            gearRoll = "-"
        }

        if(artExpr != "None") {
            artifactRoll = [new Roll(artExpr).evaluate({async:false}).total];
        } else {
            artifactRoll = "-"
        }
        
       
        let res = {
            base:[],
            skill:[],
            gear:[],
            artifact:[]
        };

        res.base[0] = statExpr;
        res.base[1] = statRoll;
        res.skill[0]= skillExpr;
        res.skill[1] = skillRoll;
        res.gear[0] = gearExpr;
        res.gear[1] = gearRoll;
        res.artifact[0] = artExpr;
        res.artifact[1] = artifactRoll
        
        this.rollResults = res;

        this._parseSuccess(res);
     }

     

     doPoolRoll() {

        let str = new Roll(this.statDice+"d6");
        str.evaluate({async:false});
        console.log("Basic Roll: ", str); 
        let skr = new Roll(this.skillDice+"d6");
        skr.evaluate({async:false});
        let gr = new Roll(this.gearDice+"d6");
        gr.evaluate({async:false});
        let ar = new Roll(this.artDice+"d6");
        ar.evaluate({async:false});

        console.log("statRolls result: ", str.terms[0].values);

        let statRolls = str.terms[0].values; // str.result.split(" + ");
        let skillRolls = skr.terms[0].values;
        let gearRolls = gr.terms[0].values;
        let artRolls = ar.terms[0].values;

        statRolls.unshift(str.formula);
        skillRolls.unshift(skr.formula);
        gearRolls.unshift(gr.formula);
        artRolls.unshift(ar.formula);

        let res = {
            base:statRolls,
            skill: skillRolls,
            gear: gearRolls,
            artifact: artRolls
        }

        this.rollResults = res;

        this._parseSuccess(res);

     }
 
     getDieExpression(dieCode) {
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