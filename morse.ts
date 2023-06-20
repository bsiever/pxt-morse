

//% color=#cf64ed
//% icon="\uf0a7"
//% block="Morse Code Decoder"
namespace morseDecoder {

export enum Space {
    //% block="between letters"
    InterLetter = 3,
    //% block="between words"
    InterWord = 7,
    //% block="dit space"
    Small = 0,
}
    
const DIT = 1
const DAH = 2
    
const morseTree = "?ETIANMSURWDKGOHVF?L?PJBXCYZQ??54?3???2??+????16=/?????7???8?90?"
const MAX_STATE = morseTree.length-1
const START_STATE = 0
const ERROR_CODE = '?'

// Current position in Morse tree
let state = START_STATE

let errorHandler: () => void = null 
let codeSelectHandler: (code: string) => void = null
    
//% blockId=dit block="dit"
//% weight=500
export function dit() {
    state = Math.min(2 * state + DIT, MAX_STATE)
    if (morseTree.charAt(state) == ERROR_CODE) {
        if (errorHandler != null) {
            errorHandler()
        }        
    }
} 
    
//% blockId=dah block="dah"
//% weight=400 
export function dah() {
    state = Math.min(2 * state + DAH, MAX_STATE)
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

}
