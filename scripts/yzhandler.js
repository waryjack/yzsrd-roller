import { YZRoll } from "./yzroll.js";

export default class YZHandler {


    static launchRoll() {

        // set template based on roll mode (either D6 pool, or step dice)
        let template = "template placeholder";

        // build roll dialog
        // trigger callbacks to YZRoll, etc.
        createRollDialog(template);


    }

    static pushRoll(roll) {

        roll.pushRoll();
        createChatMessage(roll, template);


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
                        callback: (html) => { /*collect and roll*/ }
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



    static createChatMessage(roll, template) {




    }




}