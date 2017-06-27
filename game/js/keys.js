//predefined active keys for the game
const CONST_KEYS = {
    key1: {
        keyCode: 32,
        keyName: "SPACE",
    },
    key2: {
        keyCode: 37,
        keyName: "LEFT",
    },
    key3: {
        keyCode: 38,
        keyName: "UP",
    },
    key4: {
        keyCode: 39,
        keyName: "RIGHT",
    },
    key5: {
        keyCode: 40,
        keyName: "DOWN",
    }
};

const CONST_KEY_EVENTS = {
    key1: "keydown",
    key2: "keyup",
    key3: "click"
};

export { CONST_KEYS, CONST_KEY_EVENTS };
