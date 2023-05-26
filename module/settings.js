export const registerSettings = function() {

    game.settings.register("yzsrd-roller", 'stepDice', {
        name: 'Step Dice Variant',
        hint: 'Use step dice instead of D6 dice pools',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });


}