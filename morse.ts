
//% color=#6a8694
//% icon="\uf141"
//% block="Morse Code"
//% groups="['Keying', 'Decoding', 'Encoding', 'Advanced']"
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
    const MAX_SEQUENCE_LENGTH = 6

    // Current position in Morse tree
    let state = START_STATE
    let sequence = ""
    let codeSelectHandler: (code: string, sequence: string) => void = null

    // State variables for timing of keying in new symbols
    let _dotTime = 1000 // ms 
    let keyDownEvent : number = null
    let keyUpEvent : number = null
    let symbolHandler: (sym: string) => void = null

    /**
     * The "key" to enter a Morse character has been pressed
     */
    //% blockId=keyDown block="key down"
    //% group="Keying"
    //% weight=900
    export function keyDown() {
        const now = control.millis()
        if (keyUpEvent != null) {
            const duration = now - keyUpEvent
            // Check for word spacing
            if(duration > 6 * _dotTime) {
                // Shouldn't happen
                space(Space.InterWord)
            } else 
            if (duration > 2 * _dotTime) {
                space(Space.InterLetter)
            }
        }
        keyUpEvent = null
        keyDownEvent = now
    }

    /**
     * The "key" to enter a Morse character has been released
     */
    //% blockId=keyUp block="key up"
    //% group="Keying"
    //% weight=875
    export function keyUp() {
        const now = control.millis()

        // Process how long the key was down 
        if (keyDownEvent != null) {
            const duration = now - keyDownEvent
            if (duration <= 2 * _dotTime) {
                dot()
            } else if (duration > 2 * _dotTime) {
                dash()
            } else {
                // Invalid duration; Can't happen
            }
        }
        keyDownEvent = null
        keyUpEvent = now
    }
    
    /**
     * Set the length of time for a "dot" in milliseconds (100ms-5000ms)
     */
    //% blockId=setDotTime block="set dot time to $time ms" 
    //% advanced=true
    //% group="Keying"
    //% weight=850
    //% time.defl=1000 time.min=100 time.max=5000
    export function setDotTime(time: number) {
        // Minimum time of 100ms
        _dotTime = Math.constrain(time, UPDATE_INTERVAL, 5000)
    }

    /**
     * The length of time for a "dot" in milliseconds
     */
    //% block="dot time (ms)" 
    //% group="Keying"
    //% advanced=true
    //% weight=840
    export function dotTime() : number {
        // Minimum time of 100ms
        return _dotTime
    }

    /**
     * Reset timing for key up/down
     */
    //% blockId=resetTiming block="reset timing"
    //% group="Keying" advanced=true
    //% weight=815
    export function resetTiming() {
        keyDownEvent = null
        keyUpEvent = null
    }

    /**
     *  Respond to a new symbol
     */
    //% blockId=onNewSymbol block="on symbol $newSymbol entered"
    //% group="Keying"
    //% draggableParameters
    //% advanced=true
    //% weight=800
    export function onNewSymbol(handler: (newSymbol: string) => void) {
        symbolHandler = handler
    }


    /**
     *  Respond to a completed code for a character
     */
    //% blockId=onCodeSelected block="on $code ($sequence) selected"
    //% group="Decoding"
    //% draggableParameters
    //% weight=775
    export function onCodeSelected(handler: (code: string, sequence: string) => void) {
        codeSelectHandler = handler
    }

    /**
     * Record a complete dot
     */
    //% blockId=dot block="dot"
    //% group="Decoding"
    //% advanced=true
    //% weight=950
    export function dot() {
        state = Math.min(2 * state + DOT, MAX_STATE)
        if (sequence.length < MAX_SEQUENCE_LENGTH) {
            sequence += DOT_CHAR
        }
        if(symbolHandler != null) {
            symbolHandler(".")
        }
    }

    /**
     * Record a complete dash
     */
    //% blockId=dash block="dash"
    //% group="Decoding"
    //% advanced=true
    //% weight=925
    export function dash() {
        state = Math.min(2 * state + DASH, MAX_STATE)
        if (sequence.length < MAX_SEQUENCE_LENGTH) {
            sequence += DASH_CHAR
        }
        if (symbolHandler != null) {
            symbolHandler("-")
        }
    }

    /**
     * Record a space of some sort (between characters or words)
     */
    //% blockId=space block="space $kind"
    //% kind.defl=Space.InterLetter
    //% group="Decoding"
    //% advanced=true
    //% weight=900
    export function space(kind?: Space) {
        if (symbolHandler != null) {
            let sym = "?"
            switch(kind) {
                case null:
                case Space.Small:
                    sym = " "
                    break
                case Space.InterLetter:
                    sym = "&"
                    break
                case Space.InterWord:
                    sym = "#"
                    break
            }
            symbolHandler(sym)
        }

        // Ignore small spaces
        if (kind == null || kind == Space.Small) {
            return;
        }
        // Process code
        if (codeSelectHandler != null) {
            let code = morseTree.charAt(state)
            codeSelectHandler(code, sequence)
        }
        resetDecoding()
    }

    /**
     * Reset processing of a dot/dash/space sequence
     */
    //% blockId=resetDecoding block="reset decoding"
    //% group="Decoding"
    //% advanced=true
    //% weight=675
    export function resetDecoding() {
        state = START_STATE
        sequence = ""
    }  

    /**
       * Peek at the code that would be chosen from the current sequence if there is a sufficient space
       */
    //% blockId=peekCode block="peek current code"
    //% group="Decoding"
    //% advanced=true
    //% weight=820
    export function peekCode(): string {
        return morseTree.charAt(state);
    }

    /**
     * Peek at the sequence of dots/dashes that is currently entered. 
     * 
     */
    //% blockId=peekSequence block="peek current sequence"
    //% group="Decoding"
    //% advanced=true
    //% weight=810
    export function peekSequence(): string {
        return sequence;
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
     * @return string of dots, dashes, spaces (between chars), # (between words) and newlines.
     */
    //% blockId=encode block="encode $characters to morse"
    //% group="Encoding"
    //% weight=500
    export function encode(characters: string) : string {
        let result = ""
        let lastC = null
        for(let c of characters) {
            switch(c) {
                case " ":
                    result += "#"
                break;
                case "\n":
                    result += c
                break;
                default: 
                    // Space between any real characters
                    if(lastC!=null && lastC!=" " && lastC!="\n") {
                        result += " " 
                    }
                    result += encodeChar(c)
            }
            lastC = c
        }
        return result
    }

    loops.everyInterval(UPDATE_INTERVAL, function () {
        // Check for spaces / dones (no key pressed for a bit)
        if(keyUpEvent!=null) {
            const now = control.millis()
            const duration = now - keyUpEvent
            // Check for word completion
            if (duration > 6 * _dotTime) {
                // Weed out any start states / empty codes (blips)
                if(state!=START_STATE) {
                    //serial.writeLine("Q-IWS")
                    space(Space.InterWord)
                }
                keyUpEvent = null
            }
        }
    })
}
