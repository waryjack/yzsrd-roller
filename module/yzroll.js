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
    async pushRoll() {

        this.successes = 0;
        this.banes = 0;
        console.log("the pushed roll: ", this);
       
        let keyArray = ["base", "skill", "gear", "artifact"];
        let res = this.rollResults;

        let thrownDie = {};
        let diceArray = [];
        let diceData = {};
        let color = "";

        if(this.stepDice) {
            for (const k of keyArray) {
                    switch(k) {
                        case "base": color = "black"; break;
                        case "skill": color = "blue"; break;
                        case "gear": color = "green"; break;
                        case "artifact": color = "red"; break;
                    }
                    let rerollExpr = res[k][0];
                    if(res[k][1] == 1 || res[k][1] == "-") {
                        //do nothing
                    } else {
                        let reroll = await new Roll(rerollExpr).evaluate();
                        res[k][1] = reroll.total;

                        thrownDie = {
                            result: reroll.total,
                            resultLabel:reroll.total,
                            type: rerollExpr.substring(1),
                            vectors:[],
                            options:{colorset:color}
                        }
        
                        diceArray.push(thrownDie);
                    }
                

            };

            diceData = {
                throws:[
                    {
                        dice:diceArray
                    }
                ]
           }

            console.log("REsults after push: ", res);
            this.rollResults = res;
            this.isPush = true;
            if(game.settings.get('yzsrd-roller', 'dsn') && game.modules.get('dice-so-nice')?.active) {
                game.dice3d.show(diceData, game.user, true);
            }
            

        } else {

            for (const k of keyArray) {

                // let rerollExpr = res[k][0];
                switch(k) {
                    case "base": color = "black"; break;
                    case "skill": color = "blue"; break;
                    case "gear": color = "green"; break;
                    case "artifact": color = "red"; break;
                }
                for (const v of res[k]) {
                    if(res[k].indexOf(v) == 0) {
                        //do nothing
                    } else if(v == 1 || v == "-") {
                        //do nothing
                    } else {
                        let reroll = await new Roll("1d6").evaluate();
                        let loc = res[k].indexOf(v);
                        res[k][loc] = reroll.result;
                        
                        let thrownDie = {
                                result:reroll.result,
                                resultLabel:reroll.result,
                                type: "d6",
                                vectors:[],
                                options:{colorset:color}
                        }
            
                        diceArray.push(thrownDie);
                    }


                };
               
            };    

            diceData = {
                throws:[
                    {
                        dice:diceArray
                    }
                ]
           }
            
            this.rollResults = res;
            if(game.settings.get('yzsrd-roller', 'dsn') && game.modules.get('dice-so-nice')?.active) {
                game.dice3d.show(diceData, game.user, true);
            }
        }



        console.log("REsults after push: ", res);
       
        this.diceDisplay = this.createDiceImgs();
        this.isPush = true;

        this._parseSuccess(res);

    }

     //Determine number of successes, banes, and assemble an array including only dice that remain pushable
     _parseSuccess(resultObject) {
  
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

     async doStepRoll() {
        
        let statExpr = this.getDieExpression(this.statDice);
        let skillExpr = this.getDieExpression(this.skillDice);
        let gearExpr = this.getDieExpression(this.gearDice);
        let artExpr = this.getDieExpression(this.artDice);
        let statRoll = 0;
        let skillRoll = 0;
        let gearRoll = 0;
        let artifactRoll = 0;
        let statImg = "modules/yzsrd-roller/assets/dice_black";
        let skillImg = "modules/yzsrd-roller/assets/dice_blue";
        let gearImg = "modules/yzsrd-roller/assets/dice_green";
        let artImg = "modules/yzsrd-roller/assets/dice_red";



        if (statExpr != "None") {
            let sr = await new Roll(statExpr).evaluate();
            statRoll = sr.total;
           /* statImg += `/${statExpr.substring(1)}-${statRoll}.png`;
            statImg = `<img src="${statImg}" height="36" width="36" style="border:0px !important;">`;*/
        } else {
            statRoll = "-"
            statImg = ""
        }

        if (skillExpr != "None") {
            let skr = await new Roll(skillExpr).evaluate();
            skillRoll = skr.total;
        } else {
            skillRoll = "-"
        }

        if(gearExpr != "None") {
            let gr = await new Roll(gearExpr).evaluate();
            gearRoll = gr.total;
        } else {
            gearRoll = "-"
        }

        if(artExpr != "None") {
            let ar = await new Roll(artExpr).evaluate();
            artifactRoll = ar.total;
        } else {
            artifactRoll = "-"
        }
        
       
        let res = {
            base:[],
            skill:[],
            gear:[],
            artifact:[]
        };

        // Construct DSN throw data
        if(game.settings.get("yzsrd-roller", "dsn") && game.modules.get('dice-so-nice')?.active) {
            let thrownDie = {};
            let diceArray = [];

            if(statRoll != "-") {
                thrownDie = {
                    result: statRoll,
                    resultLabel:statRoll,
                    type: statExpr.substring(1),
                    vectors:[],
                    options:{colorset:'black'}
                }

                diceArray.push(thrownDie);
            }

            if(skillRoll != "-") {
                thrownDie = {
                    result:skillRoll,
                    resultLabel:skillRoll,
                    type:skillExpr.substring(1),
                    vectors:[],
                    options:{colorset:'blue'}
                }

                diceArray.push(thrownDie);
            }

            if(gearRoll != "-") {
                thrownDie = {
                    result:gearRoll,
                    resultLabel: gearRoll,
                    type:gearExpr.substring(1),
                    vectors:[],
                    options:{colorset:'green'}
                }

                diceArray.push(thrownDie);
            }

            if(artifactRoll != "-") {
                thrownDie = {
                    result:artifactRoll,
                    resultLabel:artifactRoll,
                    type:artExpr.substring(1),
                    vectors:[],
                    options:{colorset:'red'}
                }

                diceArray.push(thrownDie)
            }

           let diceData = {
                throws:[
                    {
                        dice:diceArray
                    }
                ]
           }

           console.log("Step Dice DSN data: ", diceData);

           game.dice3d.show(diceData, game.user, true);

        }

        res.base[0] = statExpr;
        res.base[1] = statRoll;
        res.skill[0]= skillExpr;
        res.skill[1] = skillRoll;
        res.gear[0] = gearExpr;
        res.gear[1] = gearRoll;
        res.artifact[0] = artExpr;
        res.artifact[1] = artifactRoll
        res.statImg = statImg;

       
        console.log("Res: ", res);
        this.rollResults = res;
        this.diceDisplay = this.createDiceImgs();
        this._parseSuccess(res);
     }

     

     async doPoolRoll() {

        let str = await new Roll(this.statDice+"d6").evaluate();
        let skr = await new Roll(this.skillDice+"d6").evaluate();
        let gr = await new Roll(this.gearDice+"d6").evaluate();
        let ar = await new Roll(this.artDice+"d6").evaluate();
        

        console.log("statRolls formula: ", str.formula);
        console.log("statRolls result: ", str.terms[0].values);
        console.log("statrolls result 2: ", str.result);

       

        let statRolls = str.terms[0].values; // str.result.split(" + ");
        let skillRolls = skr.terms[0].values;
        let gearRolls = gr.terms[0].values;
        let artRolls = ar.terms[0].values;

        // Testing Dice So Nice! integration

        if(game.settings.get("yzsrd-roller", "dsn") && game.modules.get('dice-so-nice')?.active) {

            let statThrowArray = [];
            let skillThrowArray = [];
            let gearThrowArray = [];
            let artThrowArray = [];
            let tmpDice = [];

            // Build roll sets individually (these iterations can be combined later for efficiency; right now
            // just learning how to use the DSN API)

            statRolls.forEach(d => {
                let thrownDie = {
                    result:d,
                    resultLabel:d,
                    type: "d6",
                    vectors:[],
                    options:{colorset:"black"}
                }

                statThrowArray.push(thrownDie);
            }); 
    
            statThrowArray.forEach(t => {
                tmpDice.push(t);
                

            })
            
            let statThrowFinal = {
                throws:[
                    {
                        dice:tmpDice
                    }
                ]
            }

            // Build skill roll set (rinse and repeat)
            tmpDice = [];

            skillRolls.forEach(d => {
                let thrownDie = {
                    result:d,
                    resultLabel:d,
                    type: "d6",
                    vectors:[],
                    options:{colorset:"blue"}
                }

                skillThrowArray.push(thrownDie);
            }); 
    
            skillThrowArray.forEach(t => {
                tmpDice.push(t);
            })
            
            let skillThrowFinal = {
                throws:[
                    {
                        dice:tmpDice
                    }
                ]
            }

             // Build gear roll set (rinse and repeat)
             tmpDice = [];

             gearRolls.forEach(d => {
                 let thrownDie = {
                     result:d,
                     resultLabel:d,
                     type: "d6",
                     vectors:[],
                     options:{colorset:"green"}
                 }
 
                 gearThrowArray.push(thrownDie);
             }); 
     
             gearThrowArray.forEach(t => {
                 tmpDice.push(t);
             })
             
             let gearThrowFinal = {
                 throws:[
                     {
                         dice:tmpDice
                     }
                 ]
             }

             // Build artifact/special set 

              // Build skill roll set (rinse and repeat)
            tmpDice = [];

            artRolls.forEach(d => {
                let thrownDie = {
                    result:d,
                    resultLabel:d,
                    type: "d6",
                    vectors:[],
                    options:{colorset:"red"}
                }

                artThrowArray.push(thrownDie);
            }); 
    
            artThrowArray.forEach(t => {
                tmpDice.push(t);
            })
            
            let artThrowFinal = {
                throws:[
                    {
                        dice:tmpDice
                    }
                ]
            }




            game.dice3d.show(statThrowFinal, game.user, true);
            game.dice3d.show(skillThrowFinal, game.user, true);
            game.dice3d.show(gearThrowFinal, game.user, true);
            game.dice3d.show(artThrowFinal, game.user, true);

        }

        statRolls.unshift(str.formula);
        skillRolls.unshift(skr.formula);
        gearRolls.unshift(gr.formula);
        artRolls.unshift(ar.formula);



       
        let res = {
            base: statRolls,
            skill: skillRolls,
            gear: gearRolls,
            artifact: artRolls
        }

        this.rollResults = res;
        this.diceDisplay = this.createDiceImgs();
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

    createDiceImgs() {
        let statImg = "modules/yzsrd-roller/assets/dice_black";
        let skillImg = "modules/yzsrd-roller/assets/dice_blue";
        let gearImg = "modules/yzsrd-roller/assets/dice_green";
        let artImg = "modules/yzsrd-roller/assets/dice_red";
        let keyArray = ["base", "skill", "gear", "artifact"];
        let imgString = "";
        let imgBase = "";

        let r = this.rollResults;

        console.log("Roll results for createDiceImgs: ", r);

        keyArray.forEach(key => {
            switch(key) {
                case "base": imgBase = statImg; break;
                case "skill": imgBase = skillImg; break;
                case "gear": imgBase= gearImg; break;
                case "artifact": imgBase = artImg; break;
                default: imgBase = skillImg;
            }

            console.log("Key in roll results: ", r[key]);

            if (Array.isArray(r[key]) && r[key].length != 0) {
                let dieCode = r[key][0].substring(1);
                let justResults = r[key].slice(1);
                console.log("Just results shifted array: ", justResults);
                justResults.forEach(result => {
                    if(dieCode === "one" || result === "-") {
                        // do nothing, no code
                    } else {
                        imgString = imgString + `<img class="yzsrd-img" src="${imgBase}/${dieCode}-${result}.png" height="36" border="0" width="36" style="border:0px;">`;
                    }
                })
            }

        })
        
        return imgString;


    }
}