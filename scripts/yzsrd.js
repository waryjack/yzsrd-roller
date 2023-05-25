import { YZHandler } from "./yzhandler.js";

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
  console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.once("ready", function() {
  console.log("This code runs once core initialization is ready and game data is available.");

  const diceIconSelector = '#chat-controls i.fas.fa-dice-d20';
    $(document).on('click', diceIconSelector, () => { 
        YZHandler.launchRoll();
    });

});

Hooks.on('renderChatMessage', (app, html) => {

    html.on('click', '.push-roll', event => {

        // get roll data from chat message
        YZHandler.pushRoll(roll);
        
     });

});