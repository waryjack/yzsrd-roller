import { YZHandler } from "./yzhandler.js";

console.log("Hello World! This code runs immediately when the file is loaded.");

Hooks.on("init", function() {
  console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
});

Hooks.once("ready", function() {
  console.log("This code runs once core initialization is ready and game data is available.");

  const diceIconSelector = '#chat-controls i.fas.fa-dice-d20';
    $(document).on('click', diceIconSelector, () => { 
        
        console.log("clicked it");

        YZHandler.launchRoll();
    });

});

Hooks.on('renderChatMessage', (app, html) => {

    html.on('click', '#pushRoll', event => {
        event.preventDefault();
        let element = event.currentTarget;
        let roll = element.dataset.rollId;
        // get roll data from chat message
        YZHandler.pushRoll(roll);
        
     });

});