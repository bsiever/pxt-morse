

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

// Current position in Morse tree
let state = START_STATE

let errorHandler: () => void = null 
let codeSelectHandler: (code: string) => void = null
    
//% blockId=dot block="dot"
//% weight=500
export function dot() {
    state = Math.min(2 * state + DOT, MAX_STATE)
    if (morseTree.charAt(state) == ERROR_CODE) {
        if (errorHandler != null) {
            errorHandler()
        }        
    }
} 
    
//% blockId=dash block="dash"
//% weight=400 
export function dash() {
    state = Math.min(2 * state + DASH, MAX_STATE)
    if(morseTree.charAt(state) == ERROR_CODE) {
        if (errorHandler != null) {
            errorHandler()
        }        
    }
} 

//% blockId=reset block="reset"
//% weight=300 
export function reset() {
    state = START_STATE
}
    
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
        if (code != '?') {
            codeSelectHandler(code)
        } else {
            if (errorHandler != null) {
                errorHandler()
            }
        }
    }
    state = START_STATE
}
      
//% blockId=onCodeSelected block="on $code selected"
//% draggableParameters
//% weight=100
export function onCodeSelected(handler: (code: string) => void) {
    codeSelectHandler = handler
}

//% blockId=onError block="on error"
//% weight=50 
export function onError(handler: () => void) {
    errorHandler = handler
}

// Find the code for a single character 
// Length of string must be exactly 1
// Returns null for invalid characters
//% blockId=encodeCharacter block="encode $character"
//% weight=50 
export function encodeChar(character: string) : string {
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

export function encode(characters: string) : string {
    let result = ""
    for(let c of characters) {
        switch(c) {
            case " ":
                result += c
            break;
            case "\n":
                result += c
            break;
            default: 
                result += encodeChar(c)            
        }
    }
    return result
}



/*
 * TODO:
 *  keyDown
 *  keyUp
 *  setDotTime (default based on Morse)
 *      Include fraction of error time allowed (50% default?)
 *      Max?

 *  encode(char)
 * 
 *  Change Callback to provide / track dots/dashes and always be called.
 */
}
