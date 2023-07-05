
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
    let _maxDotTime = 100 // ms 
    let _maxDashTime = 1000 // ms 
    let _minBetweenSymbolsTime = 500 // ms
    let _minBetweenLettersTime = 3000 // ms

    let keyDownEvent : number = null
    let keyUpEvent : number = null
    let keyLastUpEvent : number = null
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
            if(duration > _minBetweenSymbolsTime) {
                space(Space.InterLetter)
            }
        }
        keyUpEvent = null
        keyLastUpEvent = null
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
            if (duration <= _maxDotTime) {
                dot()
            } else if (duration > _maxDotTime && duration < _maxDashTime) {
                dash()
            } else { // > _maxDashTime 
                // Invalid duration; Reset this symbol 
                resetDecoding()
                resetTiming()
            }
        }
        keyDownEvent = null
        keyUpEvent = now
        keyLastUpEvent = now
    }
    
    /**
     * Set the length of time for a "dot" and "dash" in milliseconds (10ms-5000ms)
     * The max dash time will always be at least twice the dot time.
     * A dash will be any key hold between 10ms and the max dot time.  A dash will be anything greater than the dot time and less than the max dash time.
     * Values greater than the max dash time will "reset" the state of decoding.
     */
    //% blockId=setMaxDotDashTimes block="set max dot time to $dotTime ms | and max dash time to $dashTime ms$" 
    //% advanced=true
    //% group="Keying"
    //% weight=870
    //% dotTime.defl=200 dotTime.min=10 dotTime.max=5000
    //% dashTime.defl=1000 dashTime.min=10 dashTime.max=15000
    export function setMaxDotDashTimes(dotTime: number, dashTime: number) {
        // Minimum time of 100ms
        _maxDotTime = Math.constrain(dotTime, 1, 5000)
        _maxDashTime = Math.constrain(dashTime, 2*_maxDotTime, 15000)
    }

    /**
     * The maximum length of time for a "dot" in milliseconds (10-15000ms)
     */
    //% block="max dot time (ms)" 
    //% group="Keying"
    //% advanced=true
    //% weight=860
    export function maxDotTime() : number {
        // Minimum time of 100ms
        return _maxDotTime
    }

    /**
     * The maximum length of time for a "dash" in milliseconds
     */
    //% block="max dash time (ms)" 
    //% group="Keying"
    //% advanced=true
    //% weight=850
    export function maxDashTime(): number {
        // Minimum time of 100ms
        return _maxDashTime
    }


    /**
     * Set the length of time for a silence events in milliseconds. The time between letters will always be at least the time between symbols.
    */
    //% blockId=setSilenceBetweenSymbolsLettersTimes block="set minimum silence between symbols $symbolTime ms |  and max between letters to $letterTime ms$" 
    //% advanced=true
    //% group="Keying"
    //% weight=840
    //% symbolTime.defl=500 symbolTime.min=10 symbolTime.max=5000
    //% letterTime.defl=1000 letterTime.min=10 letterTime.max=15000
    export function setSilenceBetweenSymbolsLettersTimes(symbolTime: number, letterTime: number) {
        // Minimum time of 100ms
        _minBetweenSymbolsTime = Math.constrain(symbolTime, 1, 5000)
        _minBetweenLettersTime = Math.constrain(letterTime, _minBetweenSymbolsTime, 15000)
    }

    /**
     * The minimum length of time between symbols  (dots/dashes) in milliseconds
     */
    //% block="min time between symbols (ms)" 
    //% group="Keying"
    //% advanced=true
    //% weight=830
    export function minBetweenSymbolTime(): number {
        // Minimum time of 100ms
        return _minBetweenSymbolsTime
    }

    /**
     * The minmum length of time between letters of a word in milliseconds
     */
    //% block="min time between letters (ms)" 
    //% group="Keying"
    //% advanced=true
    //% weight=820
    export function minBetweenLetterTime(): number {
        // Minimum time of 100ms
        return _minBetweenLettersTime
    }


    /**
     * Reset timing for key up/down
     */
    //% blockId=resetTiming block="reset timing"
    //% group="Keying" advanced=true
    //% weight=810
    export function resetTiming() {
        keyDownEvent = null
        keyUpEvent = null
        keyLastUpEvent = null
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
        let sym = "?"
        if (symbolHandler != null) {
            switch(kind) {
                case Space.InterLetter:
                    sym = "-"
                    break
                case Space.InterWord:
                    sym = " "
                    break
                case null:
                case Space.Small:
                    sym = ""
                    break
            }
            symbolHandler(sym)
        }

        // Ignore small spaces
        if (kind == null || kind == Space.Small) {
            return;
        }
        // Process code: Send " " for end of word/transmission.
        if (codeSelectHandler != null) {
            if(kind == Space.InterWord) {
                codeSelectHandler(" ", "")
            } else {
                const code = morseTree.charAt(state)
                codeSelectHandler(code, sequence)
            }
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
        const now = control.millis()
        if(keyUpEvent!=null) {
            const duration = now - keyUpEvent
            // Weed out any start states / empty codes (blips)
            if(state != START_STATE) {
                // Check for letter completion
                if (duration > _minBetweenSymbolsTime) {
                    space(Space.InterLetter)
                    keyUpEvent = null
                }
            }
        }
        if(keyLastUpEvent != null) {
            const duration = now - keyLastUpEvent
            if (duration > _minBetweenLettersTime) {
                space(Space.InterWord)
                keyLastUpEvent = null
            } 
        }
    })
}
