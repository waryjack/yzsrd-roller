import { YZRoll } from "./yzroll.js";

export class YZHandler {

    
    static launchRoll() {

        // set template based on roll mode (either D6 pool, or step dice)
        let template = "modules/yzsrd-roller/templates/stepdice-roll-dialog.hbs";
        console.log("called YZHandler.launchroll");
       
        YZHandler.createRollDialog(template);
 

    }

    static pushRoll(roll) {

        let pushedRollData = JSON.parse(roll);
        console.log("triggered push");
        console.log("Roll from Push Click: ", pushedRollData);
        let pushedRoll = new YZRoll(pushedRollData, true);
        pushedRoll.pushRoll();

        let outcome = pushedRoll.rollResults;

        console.log("Outcome after push: ", outcome);
        console.log("Outcome.artifact[1]: ", outcome.artifact[1]);
                            let sb = pushedRoll.sb;
                            let sux = pushedRoll.successes;
                            let banes = pushedRoll.banes;
                            let push = pushedRoll.isPush;

                            let msgData = {
                                roll: pushedRoll,
                                statDie: outcome.base[0],
                                skillDie: outcome.skill[0],
                                gearDie: outcome.gear[0],
                                artifactDie: outcome.artifact[0],
                                statResult: outcome.base[1],
                                skillResult: outcome.skill[1],
                                gearResult: outcome.gear[1],
                                artifactResult: outcome.artifact[1],
                                sb: sb,
                                successes: sux,
                                banes: banes,
                                isPush: push
                            }


        YZHandler.createChatMessage(msgData);


    }

    static createRollDialog(template) {

        renderTemplate(template).then((dlg) => {
            new Dialog({
                title: "Step Dice Roll",
                content:dlg,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Roll",
                        callback: (html) => { /*collect and roll*/ 

                            let std = Number(html.find("#skillDice").val());
                            let skd = Number(html.find("#statDice").val());
                            let grd = Number(html.find("#gearDice").val());
                            let ard = Number(html.find("#artifactDice").val());
                            let dmg = 0;

                            let rdata = {
                                statDice: std,
                                skillDice: skd,
                                gearDice: grd,
                                artDice: ard,
                                dmgDice: dmg
                            }

                            let thisRoll = new YZRoll(rdata, false);
                            thisRoll.doStepRoll();
                            console.log(thisRoll);

                            let outcome = thisRoll.rollResults;
                            let sb = thisRoll.sb;
                            let sux = thisRoll.successes;
                            let banes = thisRoll.banes;
                            let push = thisRoll.isPush;

                            let msgData = {
                                roll: JSON.stringify(thisRoll),
                                statDie: outcome.base[0],
                                skillDie: outcome.skill[0],
                                gearDie: outcome.gear[0],
                                artifactDie: outcome.artifact[0],
                                statResult: outcome.base[1],
                                skillResult: outcome.skill[1],
                                gearResult: outcome.gear[1],
                                artifactResult: outcome.artifact[1],
                                sb: sb,
                                successes: sux,
                                banes: banes,
                                isPush: false
                            }

                            YZHandler.createChatMessage(msgData);

                        }
                    },
                    close: {
                        icon: '<i class="fa fa-times"></i>',
                        label: "Cancel",
                        callback: () => {return;}
                    }
                },
                default:"close"
            }).render(true);
        });
    }

    static createChatMessage(data) {

        let template = "";

            if(data.isPush) {
                template = "modules/yzsrd-roller/templates/push-message.hbs";
            } else {
                template = "modules/yzsrd-roller/templates/roll-message.hbs";
            }

            renderTemplate(template, data).then((msg)=>{
                ChatMessage.create({
                    user: game.user._id,
                    // roll: data.roll,
                    type:CONST.CHAT_MESSAGE_TYPES.ROLL,
                    speaker: ChatMessage.getSpeaker(),
                    content: msg
                });
                
            });



    }



}