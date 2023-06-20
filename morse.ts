

//% color=#cf64ed
//% icon="\uf0a7"
//% block="Morse Code Utilities"
namespace morse {

export enum Space {
    //% block="between letters"
    InterLetter = 3,
    //% block="between words"
    InterWord = 7,
    //% block="dit space"
    Small = 0,
}
    
const DOT = 1
const DASH = 2
const DOT_CHAR = "."
const DASH_CHAR = "-"  
const morseTree = "?ETIANMSURWDKGOHVF?L?PJBXCYZQ??54?3???2??+????16=/?????7???8?90?"
const MAX_STATE = morseTree.length-1
const START_STATE = 0
const ERROR_CODE = '?'
const UPDATE_INTERVAL = 100 // ms to check for updates
// Current position in Morse tree
let state = START_STATE
let sequence = ""


let dotTime = 1000 // ms 
let timeError = 0.5 // Amount of error allowed in timing 
let keyDownEvent : number = null
let keyUpEvent : number = null
const MAX_SEQUENCE_LENGTH = 5

let codeSelectHandler: (code: string, sequence: string) => void = null

/**
 * Record a complete dot
 */   
//% blockId=dot block="dot"
//% weight=500
export function dot() {
    state = Math.min(2 * state + DOT, MAX_STATE)
    if(sequence.length<MAX_SEQUENCE_LENGTH) {
        sequence += DOT_CHAR
    }
} 

/**
 * Record a complete dash
 */
//% blockId=dash block="dash"
//% weight=400 
export function dash() {
    state = Math.min(2 * state + DASH, MAX_STATE)
    if (sequence.length < MAX_SEQUENCE_LENGTH) {
        sequence += DASH_CHAR
    }
}

/**
 * Reset processing of a dot/dash/space sequence
 */
//% blockId=reset block="reset"
//% weight=300 
export function reset() {
    state = START_STATE
    sequence = ""
    keyDownEvent = null
    keyUpEvent = null
}
    
/**
 * Record a space of some sort (between characters or words)
 */ 
//% blockId=space block="space $kind"
//% kind.defl=Space.InterLetter
//% weight=200 
export function space(kind?: Space) {
    // Ignore small spaces
    if (kind == null || kind == Space.Small) {
        return; 
    }
    // Process code
    if (codeSelectHandler!=null) {
        let code = morseTree.charAt(state)
        codeSelectHandler(code, sequence)
    }
    reset()
}

/**
 *  Respond to a completed character
 */      
//% blockId=onCodeSelected block="on $code ($sequence) selected"
//% draggableParameters
//% weight=100
export function onCodeSelected(handler: (code: string, sequence: string) => void) {
    codeSelectHandler = handler
}


// Find the code for a single character 
// Length of string must be exactly 1
// Returns null for invalid characters
function encodeChar(character: string) : string {
    if (character.length != 1) {
        return null
    }
    // Upper case it
    character = character.toUpperCase()
    let start = morseTree.indexOf(character.charAt(0))
    if(start==-1) {
        return ERROR_CODE
    }
    let code = ""
    while(start>0) {
        // Odds represent dots
        if(start%2==1) {
            code = DOT_CHAR + code
        } else {
            code = DASH_CHAR + code
        }
        start = Math.idiv(start-1, 2)
    }
    return code
}

/**
 * Encode the given characters to morse code.
 * @return string of dots, dashes, spaces (between chars), tabs (between words) and newlines.
 */
//% blockId=encode block="encode $characters to morse"
//% weight=50 
export function encode(characters: string) : string {
    let result = ""
    let lastC = null
    for(let c of characters) {
        switch(c) {
            case " ":
                result += "\t"
            break;
            case "\n":
                result += c
            break;
            default: 
                // Space between any real characters
                if(lastC!=null && lastC!="\t" && lastC!="\n") {
                    result += " " 
                }
                result += encodeChar(c)
        }
        lastC = c
    }
    return result
}

/**
 * Set the length of time for a "dot" in milliseconds (minimum is 100ms)
 */
//% blockId=setDotTime block="set dot time to $time ms"
//% weight=50 
export function setDotTime(time : number) {
    // Minimum time of 100ms
    dotTime = Math.max(time, UPDATE_INTERVAL)
}

/**
 * The "key" to enter a Morse character has been pressed
 */
//% blockId=keyDown block="key down"
export function keyDown() {
    const now = control.millis()
    if(keyUpEvent!=null) {
        const duration = now - keyDownEvent
        if (duration > 2.5 * dotTime && duration < 3.5 * dotTime) {
            space(Space.InterWord)
        }
    }
    keyDownEvent = control.millis()
}

/**
 * The "key" to enter a Morse character has been released
 */
//% blockId=keyUp block="key up"
export function keyUp() {
    const now = control.millis()
    keyUpEvent = now

    // Process how long the key was down 
    if(keyDownEvent != null) {
        const duration = now - keyDownEvent
        // TODO: Update to make durations more flexible
        if(duration > 0.5*dotTime && duration < 1.5*dotTime) {
            dot()
        } else
        if(duration>2.5*dotTime && duration<3.5*dotTime) {
            dash()
        } else {
            // Invalid duration
        }
    }
    keyDownEvent = null
}

loops.everyInterval(UPDATE_INTERVAL, function () {
    // Check for spaces / dones (no key pressed for a bit)
    if(keyUpEvent!=null && keyDownEvent==null) {
        const now = control.millis()
        const duration = now - keyUpEvent
        if (duration > 6.5 * dotTime - UPDATE_INTERVAL) {
            space(Space.InterWord)
        }
    }
})


/*
 * TODO: Configure tolerances. 
 */
}
