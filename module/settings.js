export const registerSettings = function() {

    game.settings.register("yzsrd-roller", 'stepDice', {
        name: 'Step Dice Variant',
        hint: 'Use step dice instead of D6 dice pools',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    game.settings.register("yzsrd-roller", 'dsn', {
        name: 'Use Dice So Nice!',
        hint: 'Enable use of the Dice So Nice! plugin',
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
}